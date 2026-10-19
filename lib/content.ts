// All portfolio copy lives here so components stay presentational.
// Every job / project is an "album"; every resume bullet is a "track".

export const profile = {
  name: "Sydney Gahunia",
  initials: "SG",
  tagline: "Systems Design Engineering @ UWaterloo · AI, full-stack & iOS",
  location: "Markham, ON",
  email: "sydneygahunia@gmail.com",
  linkedin: "https://www.linkedin.com/in/sydney-gahunia-b9a704318",
  // Hero intro, one string per paragraph.
  bio: [
    "Hi, I'm Sydney! I'm a Systems Design Engineering student at the University of Waterloo, and I love working on projects that combine technology, creativity, and real-world problem solving.",
    "Outside of engineering, I love spending my time listening to music, travelling, and skiing.",
  ],
};

export type Track = {
  title?: string; // only Playlist tracks have one (e.g. a skill name); resume bullets are just text
  group?: string; // project name; consecutive tracks with the same group are listed under one label
  detail: string;
  duration: string; // "m:ss" — sets how long the track "plays" in the player
};

export type AlbumKind = "Album" | "Single" | "EP" | "Playlist";
// What each kind is called on screen: jobs are "Experience", side projects are "Projects".
export const kindLabel: Record<AlbumKind, string> = {
  Album: "Experience",
  Single: "Project",
  EP: "Leadership",
  Playlist: "Playlist",
};
export type CoverIcon = "sparkles" | "stethoscope" | "smartphone" | "heart-pulse" | "users" | "heart" | "bot";

export type Album = {
  slug: string;
  kind: AlbumKind;
  title: string;
  role: string;
  org: string;
  period: string;
  year: string;
  location?: string;
  colors: [string, string];
  icon: CoverIcon;
  stack: string[];
  links?: { label: string; href: string }[]; // e.g. live demo, GitHub (shown on the album page)
  tracks: Track[];
};

export const albums: Album[] = [
  {
    slug: "steele-foundation",
    kind: "Album",
    title: "The Steele Foundation",
    role: "Software Engineer",
    org: "The Steele Foundation",
    period: "Sep 2026 – Present",
    year: "2026",
    colors: ["#9fe3d6", "#aecbf6"],
    icon: "sparkles",
    stack: ["Python", "FastAPI", "Azure", "Embeddings", "Vector search", "GPT"],
    tracks: [
      {
        detail:
          "Built a retrieval-augmented classification pipeline that transforms unstructured text into structured recommendations. The system embeds each input, retrieves the most relevant matches from a curated vector index, and passes those candidates to a GPT-based classifier to recommend standardized categories, including Canada's National Occupational Classification (NOC) codes.",
        duration: "4:02",
      },
      {
        detail:
          "Developed a hybrid rules engine that paired deterministic checks with LLM-based reasoning to flag key requirements and policy-sensitive conditions in unstructured documents.",
        duration: "3:18",
      },
      {
        detail:
          "Tested and improved Python/FastAPI services and Azure workflows that took documents from ingestion through AI analysis to human-in-the-loop review.",
        duration: "3:55",
      },
    ],
  },
  {
    slug: "humber-river-health",
    kind: "Album",
    title: "Humber River Health",
    role: "AI Engineer",
    org: "Humber River Health",
    period: "Jan 2026 – Apr 2026",
    year: "2026",
    location: "Toronto, ON",
    colors: ["#f7b6cf", "#cdb8f2"],
    icon: "stethoscope",
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "RAG",
      "Retell AI",
      "ElevenLabs",
      "Docker",
      "GitHub Actions",
    ],
    tracks: [
      {
        group: "AI-Powered IT Support Platform",
        detail:
          "Architected and deployed a full-stack AI support application with React, TypeScript, FastAPI, and PostgreSQL, implementing role-based authentication, persistent conversations, and automated ticket escalation.",
        duration: "4:27",
      },
      {
        group: "AI-Powered IT Support Platform",
        detail:
          "Engineered a RAG pipeline with document ingestion, sentence-transformer embeddings, pgvector similarity search, and LLM-based response generation, incorporating retrieval evaluation and source attribution.",
        duration: "3:52",
      },
      {
        group: "AI-Powered IT Support Platform",
        detail:
          "Built automated testing and CI/CD workflows using Pytest, Playwright, Docker, and GitHub Actions, with structured logging and application monitoring.",
        duration: "3:14",
      },
      {
        group: "AI Voice Routing and Switchboard System",
        detail:
          "Developed an AI-powered voice routing system integrating Retell AI, ElevenLabs, and FastAPI to classify caller intent, retrieve department information, and execute routing workflows.",
        duration: "4:10",
      },
      {
        group: "AI Voice Routing and Switchboard System",
        detail:
          "Designed PostgreSQL-backed directory and on-call scheduling services with deterministic routing, fallback handling, and human escalation.",
        duration: "3:36",
      },
      {
        group: "AI Voice Routing and Switchboard System",
        detail:
          "Implemented real-time call monitoring, transcript persistence, and automated routing tests to evaluate response latency, classification accuracy, and system reliability.",
        duration: "3:02",
      },
    ],
  },
  {
    slug: "apple-cec",
    kind: "Album",
    title: "Apple x Career Education Council",
    role: "App Developer",
    org: "Apple x Career Education Council",
    period: "Sep 2024 – Jan 2025",
    year: "2024",
    location: "Markham, ON",
    colors: ["#b7cbf7", "#d8c3f3"],
    icon: "smartphone",
    stack: ["Swift", "SwiftUI", "HealthKit", "SwiftData", "Swift Concurrency", "XCTest", "GitHub Actions"],
    tracks: [
      {
        detail:
          "Engineered an iOS heart-monitoring app using SwiftUI and HealthKit to process Apple Watch heart-rate data and identify potential elevated-heart-rate episodes through a threshold-based state machine.",
        duration: "3:48",
      },
      {
        detail:
          "Implemented asynchronous data processing with Swift Concurrency and SwiftData persistence to support heart-rate visualization and historical episode tracking.",
        duration: "3:24",
      },
      {
        detail:
          "Developed automated testing and CI workflows using XCTest and GitHub Actions to validate detection logic across 1,000+ simulated heart-rate samples and benchmark processing performance.",
        duration: "3:06",
      },
    ],
  },
  {
    slug: "forma",
    kind: "Single",
    title: "Forma",
    role: "Full-stack project",
    org: "Personal project",
    period: "Oct 2026",
    year: "2026",
    colors: ["#bff0dd", "#f6c9e0"],
    icon: "bot",
    stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "WebSockets", "Docker", "Playwright"],
    links: [
      { label: "Live demo", href: "https://forma-ten-bice.vercel.app" },
      { label: "GitHub", href: "https://github.com/sydneygahunia-wq/Forma" },
    ],
    tracks: [
      {
        detail:
          "Built a full-stack e-commerce platform with Next.js, TypeScript, FastAPI, and PostgreSQL, where orders are fulfilled by a simulated fleet of warehouse robots streamed live over WebSockets.",
        duration: "3:48",
      },
      {
        detail:
          "Engineered a real-time warehouse simulation where robots plan their own routes with A* pathfinding and avoid collisions, plus an order-batching scheduler that fulfilled orders 15.7% faster than first-come-first-served.",
        duration: "3:37",
      },
      {
        detail:
          "Prevented overselling with atomic PostgreSQL transactions and idempotency keys, validated by 100+ Pytest, Vitest, and Playwright tests in GitHub Actions CI.",
        duration: "3:05",
      },
    ],
  },
  {
    slug: "toolkit",
    kind: "Playlist",
    title: "Liked Skills",
    role: "Toolkit",
    org: "Everything on repeat",
    period: "Always",
    year: "2026",
    colors: ["#bde8f2", "#e4c6f2"],
    icon: "heart",
    stack: [],
    tracks: [
      { title: "Python", detail: "FastAPI services, RAG pipelines, pytest", duration: "3:30" },
      { title: "Claude API & Azure OpenAI", detail: "LLM apps, classification, tool use", duration: "3:12" },
      { title: "RAG & Vector Search", detail: "Embeddings, cosine similarity, top-k retrieval, NLP", duration: "3:45" },
      { title: "React & JavaScript", detail: "Full-stack web apps, REST APIs", duration: "2:58" },
      { title: "Swift & HealthKit", detail: "SwiftUI, SwiftData, MVVM, Xcode", duration: "3:21" },
      { title: "Docker & Nginx", detail: "Compose, reverse proxies, on-prem deploys", duration: "2:44" },
      { title: "C++, Java & SQL", detail: "Coursework and systems fundamentals", duration: "3:03" },
      { title: "Git, GitHub & Azure", detail: "Version control and cloud tooling", duration: "2:37" },
    ],
  },
];

// What the player and playlist call a track: its name if it has one, otherwise its number.
export const trackName = (album: Album, index: number) => album.tracks[index].title ?? `Track ${index + 1}`;

export const getAlbum = (slug: string) => albums.find((a) => a.slug === slug);

export const toSeconds = (duration: string) => {
  const [m, s] = duration.split(":").map(Number);
  return m * 60 + s;
};

export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export const albumLength = (album: Album) => {
  const total = album.tracks.reduce((sum, t) => sum + toSeconds(t.duration), 0);
  return `${album.tracks.length} ${album.tracks.length === 1 ? "song" : "songs"}, ${Math.round(total / 60)} min`;
};

// Skill clusters, shown as mixtapes. Straight from the resume's Skills section.
export type SkillTape = { title: string; color: string; skills: string[] };

export const skillTapes: SkillTape[] = [
  {
    title: "Languages",
    color: "#8fdccd",
    skills: ["Python", "TypeScript", "JavaScript", "C++", "Java", "Swift", "SQL", "HTML/CSS"],
  },
  {
    title: "AI / ML",
    color: "#f4aecb",
    skills: [
      "Claude API",
      "Azure OpenAI",
      "RAG",
      "Sentence-transformers",
      "Vector embeddings",
      "Vector search",
      "NLP",
    ],
  },
  {
    title: "Frameworks",
    color: "#a9c6f5",
    skills: ["React", "FastAPI", "REST APIs", "SwiftUI", "SwiftData", "HealthKit"],
  },
  {
    title: "Dev Tools",
    color: "#cbb6f2",
    skills: [
      "PostgreSQL",
      "Microsoft Azure",
      "Docker",
      "Nginx",
      "Git / GitHub",
      "Pytest",
      "Playwright",
      "Xcode",
    ],
  },
];
