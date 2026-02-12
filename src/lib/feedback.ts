const FEEDBACK_KEY = "mynews-feedback";

export type FeedbackType = "like" | "dislike" | null;

function getFeedbackMap(): Record<string, FeedbackType> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFeedbackMap(map: Record<string, FeedbackType>) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map));
}

export function getFeedback(articleId: string): FeedbackType {
  return getFeedbackMap()[articleId] ?? null;
}

/**
 * Toggle feedback for an article.
 * If same feedback is given again, it's removed (toggle off).
 * Returns the new feedback state.
 */
export function setFeedback(articleId: string, type: "like" | "dislike"): FeedbackType {
  const map = getFeedbackMap();
  if (map[articleId] === type) {
    delete map[articleId];
    saveFeedbackMap(map);
    return null;
  }
  map[articleId] = type;
  saveFeedbackMap(map);
  return type;
}
