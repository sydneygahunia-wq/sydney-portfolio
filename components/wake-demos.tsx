"use client";

import { useEffect } from "react";

import { projects } from "@/lib/content";

/**
 * Some live demos run on free hosting that sleeps when idle and takes up to a
 * minute to wake. Ping them once per visit, after the page has loaded, so
 * they are already starting up before a visitor clicks through. Fire and
 * forget: the response is never read, and failures are ignored.
 */
export function WakeDemos() {
  useEffect(() => {
    const urls = projects.flatMap((p) => (p.wakeUrl ? [p.wakeUrl] : []));
    if (urls.length === 0) return;
    try {
      if (sessionStorage.getItem("demos-woken")) return;
      sessionStorage.setItem("demos-woken", "1");
    } catch {
      /* storage unavailable (private mode): ping anyway */
    }
    const wake = () => {
      for (const url of urls) {
        fetch(url, { mode: "no-cors", cache: "no-store", keepalive: true }).catch(() => {});
      }
    };
    // Don't compete with the page's own loading.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(wake, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(wake, 1500);
    return () => clearTimeout(t);
  }, []);
  return null;
}
