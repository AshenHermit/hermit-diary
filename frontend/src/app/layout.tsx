import type { Metadata, Viewport } from "next";
import React, { Suspense } from "react";
import "@/styles/global.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import classNames from "classnames";

import { Montserrat, Roboto_Slab } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../providers/providers";
import { ErrorNotifier } from "@/components/layout/error-notifier";
import { Toaster } from "@/components/ui/toaster";
import { CookiesProvider } from "next-client-cookies/server";

// const font = Roboto_Slab({ subsets: ["latin", "cyrillic"] });
const font = Montserrat({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Hermit Diary - Personal Diary",
    template: "%s | Hermit Diary",
  },
  description:
    "Create and maintain personal diaries with cool visualizations. Organize thoughts, ideas and memories in a convenient format.",
  keywords: [
    "diary",
    "personal diary",
    "notes",
    "thought organization",
    "visualization",
    "Hermit Diary",
  ],
  authors: [{ name: "Hermit" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://diary.ashen-hermit.space"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Hermit Diary",
    title: "Hermit Diary - Personal Diary",
    description:
      "Create and maintain personal diaries with cool visualizations",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "Hermit Diary - Personal Diary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hermitdiary",
    creator: "@hermitdiary",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo512.png",
    shortcut: "/logo512.png",
    apple: "/logo512.png",
  },
  manifest: "/manifest.json",
  other: {
    "application-name": "Hermit Diary",
    "theme-color": "#ffac59",
    "msapplication-TileColor": "#ffac59",
  },
};

export const viewport: Viewport = {
  userScalable: false,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  height: "device-height",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames("dark bg-bg text-foreground", font.className)}
      >
        <Toaster />
        <ErrorNotifier />
        <CookiesProvider>
          <Suspense>
            <Providers>{children}</Providers>
          </Suspense>
        </CookiesProvider>
      </body>
    </html>
  );
}
