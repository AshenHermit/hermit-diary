import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hermit Diary - Персональный дневник",
  description:
    "Создавайте и ведите персональные дневники с прикольными визуализациями. Организуйте мысли, идеи и воспоминания в удобном формате.",
  keywords: [
    "дневник",
    "персональный дневник",
    "заметки",
    "организация мыслей",
    "визуализация",
    "Hermit Diary",
  ],
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "Hermit Diary - Персональный дневник",
    description:
      "Создавайте и ведите персональные дневники с прикольными визуализациями. Организуйте мысли, идеи и воспоминания в удобном формате.",
    type: "website",
    url: "/",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "Hermit Diary - Персональный дневник",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hermit Diary - Персональный дневник",
    description:
      "Создавайте и ведите персональные дневники с прикольными визуализациями",
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
