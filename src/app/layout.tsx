import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { fetchPortfolioData } from "@/lib/cms/fetch";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPortfolioData();
  return {
    title: data.seo.site_title,
    description: data.seo.site_description,
    keywords: data.seo.keywords,
    openGraph: {
      title: data.seo.site_title,
      description: data.seo.site_description,
      images: data.seo.og_image_url ? [data.seo.og_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo.site_title,
      description: data.seo.site_description,
      creator: data.seo.twitter_handle ?? undefined,
    },
    alternates: {
      canonical: data.seo.canonical_url ?? undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-black font-sans">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
