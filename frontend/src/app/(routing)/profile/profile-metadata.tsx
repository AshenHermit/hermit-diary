import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мой профиль - Hermit Diary",
  description:
    "Управляйте своим профилем, настройками и дневниками в Hermit Diary.",
  keywords: [
    "профиль",
    "настройки",
    "личный кабинет",
    "дневники",
    "Hermit Diary",
  ],
  authors: [{ name: "Hermit Diary Team" }],
  creator: "Hermit Diary",
  publisher: "Hermit Diary",
  openGraph: {
    title: "Мой профиль - Hermit Diary",
    description:
      "Управляйте своим профилем, настройками и дневниками в Hermit Diary.",
    type: "website",
    url: "/profile",
    siteName: "Hermit Diary",
    images: [
      {
        url: "/textures/bg.png",
        width: 1200,
        height: 630,
        alt: "Мой профиль - Hermit Diary",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Мой профиль - Hermit Diary",
    description: "Управляйте своим профилем и настройками",
    images: ["/textures/bg.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};
