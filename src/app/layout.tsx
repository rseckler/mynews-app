import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MyNews.com – Curated for You",
    template: "%s | MyNews.com",
  },
  description:
    "AI-kuratierte Nachrichten aus vertrauenswürdigen Quellen. Personalisiert, transparent, aktuell.",
  keywords: ["news", "nachrichten", "AI", "personalisiert", "kuratiert"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "MyNews.com",
    title: "MyNews.com – Curated for You",
    description:
      "AI-kuratierte Nachrichten aus vertrauenswürdigen Quellen. Personalisiert, transparent, aktuell.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyNews.com – Curated for You",
    description:
      "AI-kuratierte Nachrichten aus vertrauenswürdigen Quellen.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1A" },
  ],
};

// Inline script to apply dark mode before paint (prevents flash)
const themeScript = `(function(){try{var t=localStorage.getItem('mynews-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={300}>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
