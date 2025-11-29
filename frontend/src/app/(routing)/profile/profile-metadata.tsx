import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My profile - Hermit Diary",
  description: "Manage your profile, settings and diaries in Hermit Diary.",
  keywords: [
    "profile",
    "settings",
    "personal account",
    "diaries",
    "Hermit Diary",
  ],
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "My profile - Hermit Diary",
    description: "Manage your profile, settings and diaries in Hermit Diary.",
    type: "website",
    url: "/profile",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "My profile - Hermit Diary",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "My profile - Hermit Diary",
    description: "Manage your profile and settings",
    images: ["/textures/bg.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};
