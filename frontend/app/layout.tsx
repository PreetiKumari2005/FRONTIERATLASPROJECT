import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontier Atlas - Discover AI Research",
  description: "Discover and track the latest breakthroughs in AI and machine learning research. Trending papers, SOTA benchmarks, GitHub stars, and more.",
  keywords: "AI research, machine learning, papers, SOTA, transformers, LLM, deep learning",
  openGraph: {
    title: "Frontier Atlas - Discover AI Research",
    description: "Discover and track the latest breakthroughs in AI and machine learning research.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
