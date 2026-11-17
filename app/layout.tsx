import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { WakeDemos } from "@/components/wake-demos";
import { profile } from "@/lib/content";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${profile.name}`, template: `%s · ${profile.name}` },
  description: "Systems Design Engineering student at the University of Waterloo building AI, full-stack and iOS software.",
};

export const viewport: Viewport = {
  themeColor: "#14201f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <WakeDemos />
      </body>
    </html>
  );
}
