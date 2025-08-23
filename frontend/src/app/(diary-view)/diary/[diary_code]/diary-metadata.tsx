import { Metadata } from "next";
import { getDiary, getDiaryProperties } from "@/services/methods/user/diaries";
import { decodeId } from "@/lib/hash-utils";
import { getContentText } from "@/lib/rich-content-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ diary_code: string }>;
}): Promise<Metadata> {
  try {
    const fetchedParams = await params;
    const diaryId = decodeId("diary", fetchedParams.diary_code);
    const diary = await getDiary(diaryId);
    const properties = await getDiaryProperties(diaryId);

    const title = `${diary.name} - Hermit Diary`;
    const descriptionText = getContentText(diary.description);
    const description = descriptionText
      ? `Дневник ${diary.user.name}: ${descriptionText}`
      : `Дневник ${diary.user.name}`;

    const imageUrl =
      properties.coverImage || diary.picture || "/textures/bg.png";

    return {
      title,
      description,
      keywords: [
        "дневник",
        "заметки",
        "личный дневник",
        diary.name,
        diary.user.name,
      ],
      authors: [{ name: diary.user.name }],
      creator: diary.user.name,
      publisher: "Hermit Diary",
      openGraph: {
        title,
        description,
        type: "website",
        url: `/diary/${diary.id}`,
        siteName: "Hermit Diary",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Обложка дневника ${diary.name}`,
          },
        ],
        locale: "ru_RU",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      robots: {
        index: diary.isPublic,
        follow: diary.isPublic,
      },
      other: {
        "diary-id": diary.id.toString(),
        "diary-author": diary.user.name,
        "diary-created": diary.createdAt,
        "diary-updated": diary.updatedAt,
      },
    };
  } catch (error) {
    // Fallback metadata if diary loading fails
    return {
      title: "Дневник - Hermit Diary",
      description: "Персональный дневник",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
