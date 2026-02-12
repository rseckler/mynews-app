"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRENDING_TOPICS, getCategoryColor } from "@/lib/mock-data";

export function TrendingTopics() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Trending</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {TRENDING_TOPICS.map((topic) => (
          <button key={topic.id} className="group">
            <Badge
              variant="secondary"
              className="cursor-pointer border-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            >
              <span
                className="mr-1.5 inline-block size-1.5 rounded-full"
                style={{ backgroundColor: getCategoryColor(topic.category) }}
              />
              {topic.label}
              <span className="ml-1.5 text-muted-foreground">
                {topic.articleCount}
              </span>
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
