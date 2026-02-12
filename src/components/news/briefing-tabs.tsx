"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BriefingTabs() {
  const pathname = usePathname();
  const isMorning = pathname === "/briefing";

  return (
    <div className="flex gap-2">
      <Link
        href="/briefing"
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
          isMorning
            ? "border-primary bg-primary/10 text-primary"
            : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        <Sparkles className="size-4" />
        Morgen-Briefing
      </Link>
      <Link
        href="/digest"
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
          !isMorning
            ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
            : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        <Moon className="size-4" />
        Abend-Digest
      </Link>
    </div>
  );
}
