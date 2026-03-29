import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3003"
  ),
  title: {
    default: "ChartRacer — Bar Chart Race Video Generator",
    template: "%s · ChartRacer",
  },
  description:
    "Erstelle automatisch animierte Bar Chart Race Videos für YouTube, Instagram Reels und TikTok — mit KI-Datenrecherche via Claude.",
  keywords: [
    "Bar Chart Race",
    "Video Generator",
    "Datenvisualisierung",
    "Remotion",
    "KI",
    "Social Media Video",
  ],
  authors: [{ name: "ChartRacer" }],
  creator: "ChartRacer",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "ChartRacer",
    title: "ChartRacer — Bar Chart Race Video Generator",
    description:
      "Automatisch generierte, animierte Balkendiagramm-Videos für Social Media — mit KI-Datenrecherche.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChartRacer — Bar Chart Race Video Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChartRacer — Bar Chart Race Video Generator",
    description:
      "Automatisch generierte, animierte Balkendiagramm-Videos für Social Media — mit KI-Datenrecherche.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
