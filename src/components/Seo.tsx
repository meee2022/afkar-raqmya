import { useEffect } from "react";

const SITE = "أفكار رقمية";
const BASE_URL = "https://afkarraqmeya.com"; // ← غيّره لدومينك الحقيقي عند النشر

interface SeoProps {
  title: string;
  description: string;
  path?: string;          // e.g. "/portfolio"
  image?: string;          // absolute or root-relative OG image
}

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

/** Per-page SEO: title, description, Open Graph, Twitter, canonical. */
export default function Seo({ title, description, path = "/", image = "/og-image.png" }: SeoProps) {
  useEffect(() => {
    const fullTitle = path === "/" ? `${SITE} | حلول رقمية متكاملة` : `${title} | ${SITE}`;
    const url = BASE_URL + path;
    const img = image.startsWith("http") ? image : BASE_URL + image;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:locale", "ar_AR");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
    setCanonical(url);
  }, [title, description, path, image]);

  return null;
}
