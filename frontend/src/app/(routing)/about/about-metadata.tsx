import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте - Hermit Diary",
  description:
    "Узнайте больше о проекте Hermit Diary - персональном дневнике с прикольными визуализациями и удобным интерфейсом.",
  keywords: [
    "о проекте",
    "Hermit Diary",
    "дневник",
    "визуализация",
    "разработка",
    "технологии",
  ],
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "О проекте - Hermit Diary",
    description:
      "Узнайте больше о проекте Hermit Diary - персональном дневнике с прикольными визуализациями и удобным интерфейсом.",
    type: "website",
    url: "/about",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "О проекте Hermit Diary",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "О проекте - Hermit Diary",
    description: "Узнайте больше о проекте Hermit Diary",
    images: ["/textures/bg.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
