import type { Article } from "@/types";

const BOOKMARKS_KEY = "mynews-bookmarks";

export function getBookmarks(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(articleId: string): boolean {
  return getBookmarks().some((a) => a.id === articleId);
}

export function toggleBookmark(article: Article): boolean {
  const current = getBookmarks();
  const exists = current.findIndex((a) => a.id === article.id);

  if (exists >= 0) {
    current.splice(exists, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
    return false; // removed
  } else {
    current.unshift(article);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
    return true; // added
  }
}

export function removeBookmark(articleId: string): void {
  const current = getBookmarks().filter((a) => a.id !== articleId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
}
