import { useEffect } from "react";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const DEFAULT_TITLE = "Check the Lease. Read your lease in plain English.";

/** Set per-page <title>, description, canonical and OG tags for SPA routes. */
export function useSEO(opts: { title: string; description: string; path?: string }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = opts.title;
    setMeta("name", "description", opts.description);
    setMeta("property", "og:title", opts.title);
    setMeta("property", "og:description", opts.description);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = opts.path ?? (typeof window !== "undefined" ? window.location.pathname : "");
    if (origin && path) {
      setCanonical(origin + path);
      setMeta("property", "og:url", origin + path);
    }
    return () => { document.title = prevTitle; };
  }, [opts.title, opts.description, opts.path]);
}
