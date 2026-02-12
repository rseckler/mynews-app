"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/types";

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-border/50">
      <div
        ref={scrollRef}
        className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 lg:px-8"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "relative shrink-0 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
              {isActive && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
