import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import type { ReactNode } from "react";
import { ru } from "@/content/ru";
import "./globals.css";

const jost = Jost({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: ru.meta.title,
  description: ru.meta.description,
  openGraph: {
    title: ru.meta.title,
    description: ru.meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f8196",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
