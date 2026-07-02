import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getCachedSiteSettings } from "@/lib/db/cache";
import { buildSiteMetadata } from "@/lib/site/metadata";
import type { Viewport } from "next";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const revalidate = 300;

export const viewport: Viewport = {
  themeColor: "#22c55e",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return buildSiteMetadata(settings);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
