import { useCallback, useEffect, useState } from "react";
import { apiFetch, apiUrl } from "../config/api";

export const FALLBACK_ARTICLE_IMG =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop";

// Set VITE_USE_MOCKS=true in .env.local to work on the UI without the PHP backend
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

/**
 * Cloudinary can resize and re-encode on the fly: ask for the best format for
 * this browser (WebP/AVIF), automatic quality, and no wider than needed.
 */
export function cloudinaryResize(url, width) {
  if (!width || !/res\.cloudinary\.com\/.+\/image\/upload\//.test(url)) return url;
  if (/\/image\/upload\/[^/]*(f_auto|w_\d+)/.test(url)) return url; // already transformed
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export const articleImage = (a, width) =>
  !a?.image_path
    ? FALLBACK_ARTICLE_IMG
    : /^https?:\/\//.test(a.image_path)
      ? cloudinaryResize(a.image_path, width)
      : apiUrl(a.image_path);

export function readingTime(article) {
  if (article?.reading_minutes) return article.reading_minutes; // computed by the API
  const words = `${article?.body || ""} ${article?.summary || ""}`.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

// Sample data is only downloaded in mock mode, never in a normal build
const loadMocks = () => import("./mockArticles").then((m) => m.MOCK_ARTICLES);

async function filterMocks({ page, limit, category, search }) {
  let list = await loadMocks();
  if (category) list = list.filter((a) => a.category === category);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((a) => `${a.title} ${a.summary}`.toLowerCase().includes(q));
  }
  const total_pages = Math.max(1, Math.ceil(list.length / limit));
  return { success: true, data: list.slice((page - 1) * limit, page * limit), pagination: { total_pages } };
}

/**
 * Loads a page of articles from api/get_articles.php.
 * `category` and `search` are sent as query params (the backend should support them);
 * they're also applied client-side so the UI behaves correctly either way.
 */
export function useArticles({ page = 1, limit = 6, category = "", search = "" } = {}) {
  const [state, setState] = useState({ articles: [], totalPages: 1, loading: true, error: "" });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const params = new URLSearchParams({ page, limit });
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      const data = USE_MOCKS
        ? await filterMocks({ page, limit, category, search })
        : await apiFetch(`api/get_articles.php?${params}`);
      if (!data.success) throw new Error(data.message || "Couldn't load articles.");

      let list = Array.isArray(data.data) ? data.data : [];
      if (category) list = list.filter((a) => a.category === category);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((a) => `${a.title} ${a.summary}`.toLowerCase().includes(q));
      }
      setState({ articles: list, totalPages: data.pagination?.total_pages || 1, loading: false, error: "" });
    } catch (err) {
      console.error("Error fetching articles:", err);
      setState((s) => ({ ...s, loading: false, error: "Articles couldn't load. Check your connection and try again." }));
    }
  }, [page, limit, category, search]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

/** Loads one article from api/get_article.php?id= (name assumed — adjust to your backend). */
export async function fetchArticle(id) {
  if (USE_MOCKS) {
    const a = (await loadMocks()).find((m) => String(m.id) === String(id));
    return a ? { success: true, data: a } : { success: false, message: "Article not found." };
  }
  return apiFetch(`api/get_article.php?id=${encodeURIComponent(id)}`);
}

export const ARTICLE_CATEGORIES = [
  "Budgeting", "Savings", "Investing", "Debt Management", "Financial Planning",
  "Retirement", "Tax Planning", "Insurance", "Credit Cards", "Real Estate",
];
