import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suche",
  description: "Durchsuche aktuelle Nachrichten aus allen Kategorien.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
