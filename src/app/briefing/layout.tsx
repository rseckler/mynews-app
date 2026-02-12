import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morgen-Briefing",
  description: "Dein tägliches KI-generiertes Nachrichten-Briefing mit den wichtigsten Themen des Tages.",
};

export default function BriefingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
