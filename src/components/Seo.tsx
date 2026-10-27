import { useEffect } from "react";

import { SITE_NAME as SITE, SITE_URL as BASE_URL } from "../data/site";

interface SeoProps {
  title: string;
  description: string;
  path?: string; // e.g. "/portfolio"
  image?: string; // absolute or root-relative OG image
  noIndex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Per-page SEO: title, description, Open Graph, Twitter, canonical. */
export default function Seo({
  title,
  description,
  path = "/",
  image = "/og-image.png",
  noIndex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = path === "/" ? `ATHR | ${SITE}` : `${title} | ${SITE}`;
    const url = BASE_URL + path;
    const img = image.startsWith("http") ? image : BASE_URL + image;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:locale", "ar_QA");
    setMeta("name", "robots", noIndex ? "noindex, follow" : "index, follow");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
    setCanonical(url);
  }, [title, description, path, image, noIndex]);

  return null;
}
