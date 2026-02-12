/**
 * Share an article using Web Share API (mobile) or copy link to clipboard (desktop fallback).
 * Returns true if shared/copied successfully.
 */
export async function shareArticle(title: string, url: string): Promise<boolean> {
  // Try native Web Share API first (mobile browsers, some desktop)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if ((err as DOMException)?.name === "AbortError") return false;
    }
  }

  // Fallback: copy link to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
