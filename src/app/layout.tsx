import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CivilsPulse",
    template: "%s · CivilsPulse",
  },
  description:
    "Verified UPSC previous-year questions, Prelims mocks, and transparent preparation analytics.",
  applicationName: "CivilsPulse",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
