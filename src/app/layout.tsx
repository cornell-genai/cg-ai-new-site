import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cornellgenai.dev"),
  title: {
    default: "Cornell GenAI",
    template: "%s — Cornell GenAI",
  },
  description:
    "Cornell's student-run community for building with AI. We build AI products with industry partners and for Cornell.",
  openGraph: {
    title: "Cornell GenAI",
    description: "Cornell's student-run community for building with AI.",
    url: "https://cornellgenai.dev",
    siteName: "Cornell GenAI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f2ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
