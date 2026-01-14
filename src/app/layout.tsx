import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" }); // Added for separate Stanford page

export const metadata: Metadata = {
  title: "Generative AI @ Cornell",
  description: "Architecting Intelligence. Theoretically grounded, implementation focused.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-laser-red)] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
