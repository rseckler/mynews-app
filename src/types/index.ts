export type Category =
  | "for-you"
  | "politik"
  | "wirtschaft"
  | "sport"
  | "tech"
  | "wissenschaft"
  | "unterhaltung"
  | "gesundheit"
  | "kultur";

export type Sentiment = "positive" | "neutral" | "negative";

export type FeedReason = "interest" | "trending" | "discover";

export type ArticleVariant = "featured" | "standard" | "compact";

export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  sourceName: string;
  sourceLogo?: string;
  author?: string;
  publishedAt: string;
  category: Category;
  subcategory?: string;
  aiSummary?: string;
  sentiment?: Sentiment;
  language: string;
  readTimeMinutes: number;
  tags: string[];
  feedReason: FeedReason;
  isBreaking?: boolean;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
}

export interface UserPreferences {
  categories: Category[];
  language: string;
  darkMode: boolean;
}

export interface TrendingTopic {
  id: string;
  label: string;
  articleCount: number;
  category: Category;
}
