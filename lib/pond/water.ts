/*
 * GPU water surface (WebGL2).
 * A small height field (r = height, g = velocity) is advanced with the wave equation every frame.
 * The final pass refracts the underwater scene (koi, pond floor, moon reflection) through that surface
 * and adds glints where waves catch the light. Returns null when WebGL2 / float render targets are missing.
 */

const VERT = `#version 300 es
in vec2 p;
out vec2 uv;
void main() {
  uv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const UPDATE = `#version 300 es
precision highp float;
uniform sampler2D state;
uniform vec2 texel;
in vec2 uv;
out vec4 o;
void main() {
  vec4 info = texture(state, uv);
  float avg = (
    texture(state, uv - vec2(texel.x, 0.0)).r +
    texture(state, uv + vec2(texel.x, 0.0)).r +
    texture(state, uv - vec2(0.0, texel.y)).r +
    texture(state, uv + vec2(0.0, texel.y)).r
  ) * 0.25;
  info.g += (avg - info.r) * 2.0;
  info.g *= 0.993;
  info.r += info.g;
  info.r *= 0.9992;
  o = info;
}`;

const MAX_DROPS = 12;

const DROP = `#version 300 es
precision highp float;
uniform sampler2D state;
uniform vec4 drops[${MAX_DROPS}]; // x, y (uv), radius (uv, height-relative), strength
uniform int count;
uniform float aspect;
in vec2 uv;
out vec4 o;
void main() {
  vec4 info = texture(state, uv);
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= count) break;
    vec2 d = (uv - drops[i].xy) * vec2(aspect, 1.0);
    float k = max(0.0, 1.0 - length(d) / drops[i].z);
    k = 0.5 - cos(k * 3.14159265) * 0.5;
    info.r -= k * drops[i].w;
  }
  o = info;
}`;

const RENDER = `#version 300 es
precision highp float;
uniform sampler2D state;
uniform sampler2D scene;
uniform vec2 texel;
uniform float time;
uniform float dim;
uniform float aspect;
in vec2 uv;
out vec4 o;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

// Caustic web: bright where neighbouring cells of a drifting Voronoi pattern meet.
float caustic(vec2 p, float t) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 c = 0.5 + 0.45 * sin(t + 6.2831 * hash2(i + g));
      float d = length(g + c - f);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  return 1.0 - smoothstep(0.0, 0.11, d2 - d1);
}

void main() {
  float hL = texture(state, uv - vec2(texel.x, 0.0)).r;
  float hR = texture(state, uv + vec2(texel.x, 0.0)).r;
  float hD = texture(state, uv - vec2(0.0, texel.y)).r;
  float hU = texture(state, uv + vec2(0.0, texel.y)).r;
  vec3 n = normalize(vec3(hL - hR, hD - hU, 0.05));

  // Slow ambient swell so the water never looks frozen
  vec2 swell = vec2(
    sin(uv.y * 17.0 + time * 0.7) + sin(uv.x * 9.0 - time * 0.45),
    cos(uv.x * 13.0 + time * 0.6) + cos(uv.y * 7.0 + time * 0.4)
  ) * 0.0005;

  vec2 ruv = uv + n.xy * 0.03 + swell;
  vec3 col = texture(scene, ruv).rgb * 0.7
    + texture(scene, ruv + vec2(0.0012, 0.0)).rgb * 0.15
    + texture(scene, ruv - vec2(0.0012, 0.0)).rgb * 0.15;

  // A barely-there shimmer of light on the pond floor
  vec2 cp = (uv + n.xy * 0.02) * vec2(aspect, 1.0) * 5.0;
  cp += vec2(sin(cp.y * 1.3 + time * 0.3), cos(cp.x * 1.1 - time * 0.25)) * 0.5;
  col += vec3(0.62, 0.86, 0.8) * caustic(cp, time * 0.35) * 0.012;

  // Glints where the tilted surface catches the light, and a pale rim along wave fronts
  vec3 L = normalize(vec3(-0.35, 0.55, 1.0));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 90.0);
  float slope = clamp(length(n.xy), 0.0, 1.0);
  col += vec3(0.9, 0.98, 0.97) * spec * 0.85 + vec3(0.7, 0.85, 0.85) * slope * 0.22;

  col *= dim;
  o = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function program(gl: WebGL2RenderingContext, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "p");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer };

export type Water = {
  resize: (w: number, h: number, dpr: number) => void;
  drop: (x: number, y: number, radius: number, strength: number) => void;
  frame: (scene: HTMLCanvasElement, time: number, dim: number) => void;
  dispose: () => void;
};

export function createWater(canvas: HTMLCanvasElement): Water | null {
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  let update: WebGLProgram, dropProg: WebGLProgram, render: WebGLProgram;
  try {
    update = program(gl, UPDATE);
    dropProg = program(gl, DROP);
    render = program(gl, RENDER);
  } catch {
    return null;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const sceneTex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, sceneTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let simW = 1;
  let simH = 1;
  let targets: [Target, Target] | null = null;
  let aspect = 1;
  const pending: number[][] = [];

  const makeTarget = (): Target => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, simW, simH, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  };

  const pass = (prog: WebGLProgram, input: WebGLTexture, output: Target | null, set?: () => void) => {
    gl.useProgram(prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, output ? output.fbo : null);
    gl.viewport(0, 0, output ? simW : canvas.width, output ? simH : canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, input);
    gl.uniform1i(gl.getUniformLocation(prog, "state"), 0);
    gl.uniform2f(gl.getUniformLocation(prog, "texel"), 1 / simW, 1 / simH);
    set?.();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const swap = () => {
    if (targets) targets = [targets[1], targets[0]];
  };

  return {
    resize(w, h, dpr) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      aspect = w / h;
      // Sim grid ~220 cells on the long side: plenty for smooth waves, cheap on any GPU
      const long = 220;
      simW = Math.max(2, Math.round(w >= h ? long : long * aspect));
      simH = Math.max(2, Math.round(w >= h ? long / aspect : long));
      if (targets) for (const t of targets) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      }
      targets = [makeTarget(), makeTarget()];
    },
    drop(x, y, radius, strength) {
      // x, y in 0..1 screen space (y down); radius as a fraction of viewport height
      if (pending.length < MAX_DROPS) pending.push([x, 1 - y, radius, strength]);
    },
    frame(scene, time, dim) {
      if (!targets) return;
      if (pending.length) {
        const flat = new Float32Array(MAX_DROPS * 4);
        pending.forEach((d, i) => flat.set(d, i * 4));
        const count = pending.length;
        pending.length = 0;
        pass(dropProg, targets[0].tex, targets[1], () => {
          gl.uniform4fv(gl.getUniformLocation(dropProg, "drops"), flat);
          gl.uniform1i(gl.getUniformLocation(dropProg, "count"), count);
          gl.uniform1f(gl.getUniformLocation(dropProg, "aspect"), aspect);
        });
        swap();
      }
      for (let i = 0; i < 2; i++) {
        pass(update, targets[0].tex, targets[1]);
        swap();
      }

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
      pass(render, targets[0].tex, null, () => {
        gl.uniform1i(gl.getUniformLocation(render, "scene"), 1);
        gl.uniform1f(gl.getUniformLocation(render, "time"), time / 1000);
        gl.uniform1f(gl.getUniformLocation(render, "dim"), dim);
        gl.uniform1f(gl.getUniformLocation(render, "aspect"), aspect);
      });
    },
    dispose() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
