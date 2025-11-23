import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Hermit Diary",
  description:
    "Learn more about Hermit Diary - a personal diary with cool visualizations and a convenient interface.",
  keywords: [
    "about",
    "Hermit Diary",
    "diary",
    "visualization",
    "development",
    "technologies",
  ],
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "About - Hermit Diary",
    description:
      "Learn more about Hermit Diary - a personal diary with cool visualizations and a convenient interface.",
    type: "website",
    url: "/about",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "About Hermit Diary",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Hermit Diary",
    description: "Learn more about Hermit Diary",
    images: ["/textures/bg.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
