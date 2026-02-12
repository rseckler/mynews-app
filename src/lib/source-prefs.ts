const SOURCE_PREFS_KEY = "mynews-source-prefs";

export type SourcePref = "more" | "less" | null;

function getPrefsMap(): Record<string, SourcePref> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SOURCE_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePrefsMap(map: Record<string, SourcePref>) {
  localStorage.setItem(SOURCE_PREFS_KEY, JSON.stringify(map));
}

export function getSourcePref(sourceName: string): SourcePref {
  return getPrefsMap()[sourceName] ?? null;
}

/**
 * Toggle source preference. Clicking the same pref again removes it.
 * Returns the new pref state.
 */
export function setSourcePref(sourceName: string, pref: "more" | "less"): SourcePref {
  const map = getPrefsMap();
  if (map[sourceName] === pref) {
    delete map[sourceName];
    savePrefsMap(map);
    return null;
  }
  map[sourceName] = pref;
  savePrefsMap(map);
  return pref;
}

/** Get all source preferences */
export function getAllSourcePrefs(): Record<string, SourcePref> {
  return getPrefsMap();
}
