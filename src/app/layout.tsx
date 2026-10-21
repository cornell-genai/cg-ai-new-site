import type { Metadata, Viewport } from "next";
import { Newsreader, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], axes: ["opsz"], variable: "--font-newsreader" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cornellgenai.dev"),
  title: { default: "Cornell GenAI", template: "%s — Cornell GenAI" },
  description: "Cornell's student-run community for building with AI.",
  openGraph: {
    title: "Cornell GenAI",
    description: "Cornell's student-run community for building with AI.",
    url: "https://cornellgenai.dev",
    siteName: "Cornell GenAI",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#ebebec" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="font-serif antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
