import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Geist_Mono } from "next/font/google";
import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const sans = Host_Grotesk({ subsets: ["latin"], variable: "--font-host" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-geist-mono" });

const DESCRIPTION = "Cornell students shipping AI: applied research, production systems for clients, and open source.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cornellgenai.dev"),
  title: { default: "Cornell GenAI", template: "%s — Cornell GenAI" },
  description: DESCRIPTION,
  openGraph: {
    title: "Cornell GenAI",
    description: DESCRIPTION,
    url: "https://cornellgenai.dev",
    siteName: "Cornell GenAI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-night font-sans text-bone antialiased">
        <Nav />
        <PageTransition>
          <div className="page-enter">{children}</div>
        </PageTransition>
      </body>
    </html>
  );
}
