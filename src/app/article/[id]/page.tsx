"use client";

import { use } from "react";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { getCachedArticle } from "@/lib/article-cache";
import { ArticleDetail } from "./article-detail";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);

  // Try cache first (live articles), then mock data
  const article = getCachedArticle(id) ?? MOCK_ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-lg font-semibold">Artikel nicht gefunden</p>
        <p className="text-sm text-muted-foreground">
          Dieser Artikel ist nicht mehr verfügbar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Startseite
        </Link>
      </div>
    );
  }

  return <ArticleDetail article={article} />;
}
