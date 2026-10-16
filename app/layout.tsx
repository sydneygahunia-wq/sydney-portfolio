import type { Metadata, Viewport } from "next";
import { VT323 } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { PlayerProvider } from "@/components/player-provider";
import { AppShell } from "@/components/shell/app-shell";
import { profile } from "@/lib/content";
import "./globals.css";

// The only web font: the LCD digits. Everything else is Y2K system fonts (Verdana, Arial Black, Comic Sans).
const lcd = VT323({ weight: "400", subsets: ["latin"], variable: "--font-lcd", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${profile.name} · SydAmp`, template: `%s · ${profile.name}` },
  description:
    "Systems Design Engineering student at the University of Waterloo building AI platforms, RAG pipelines, full-stack apps and iOS health tools.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={lcd.variable}>
      <body>
        <MotionProvider>
          <PlayerProvider>
            <AppShell>{children}</AppShell>
          </PlayerProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
