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
  title: "Hermits Diary",
  description: "diary",
  icons: {
    icon: "/favicon.ico",
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
