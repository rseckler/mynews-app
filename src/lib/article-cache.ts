import type { Article } from "@/types";

/** Simple client-side article cache so detail pages can access fetched articles. */
const cache = new Map<string, Article>();

export function cacheArticles(articles: Article[]) {
  for (const a of articles) {
    cache.set(a.id, a);
  }
}

export function getCachedArticle(id: string): Article | undefined {
  return cache.get(id);
}
