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
          const isForYou = cat.id === "for-you";
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "relative shrink-0 px-3 py-3 text-base font-medium transition-colors whitespace-nowrap sm:text-sm",
                isForYou && isActive
                  ? "text-primary font-bold"
                  : isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isForYou ? (
                <span className="flex items-center gap-1">
                  <span className="text-base">✦</span>
                  {cat.label}
                </span>
              ) : (
                cat.label
              )}
              {isActive && (
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-0 rounded-full",
                    isForYou ? "h-[3px]" : "h-0.5"
                  )}
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
