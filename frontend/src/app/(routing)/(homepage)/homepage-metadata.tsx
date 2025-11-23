import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hermit Diary - Personal Diary",
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
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "Hermit Diary - Personal Diary",
    description:
      "Create and maintain personal diaries with cool visualizations. Organize thoughts, ideas and memories in a convenient format.",
    type: "website",
    url: "/",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "Hermit Diary - Personal Diary",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hermit Diary - Personal Diary",
    description:
      "Create and maintain personal diaries with cool visualizations",
    images: ["/textures/bg.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "application-name": "Hermit Diary",
    "theme-color": "#ffac59",
  },
};
