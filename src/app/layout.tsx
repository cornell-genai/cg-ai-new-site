import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const sans = Host_Grotesk({ subsets: ["latin"], variable: "--font-host" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-geist-mono" });

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-night font-sans text-bone antialiased">
        <SmoothScroll />
        <Nav />
        <PageTransition>
          <div className="page-enter">{children}</div>
        </PageTransition>
      </body>
    </html>
  );
}
