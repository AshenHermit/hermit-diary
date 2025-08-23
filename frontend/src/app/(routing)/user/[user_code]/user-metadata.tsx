import { Metadata } from "next";
import { decodeId } from "@/lib/hash-utils";
import { getUser } from "@/services/methods/user/users-server";
import { getUserDiaries } from "@/services/methods/user/diaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ user_code: string }>;
}): Promise<Metadata> {
  try {
    const fetchedParams = await params;
    const userId = decodeId("user", fetchedParams.user_code);
    const user = await getUser(userId);
    const diaries = await getUserDiaries(userId);

    const title = `${user.name} - Профиль - Hermit Diary`;
    const description = `Профиль пользователя ${user.name}. Количество дневников: ${diaries.length}`;

    const imageUrl = user.picture || "/textures/bg.png";

    return {
      title,
      description,
      keywords: [
        "профиль",
        "пользователь",
        "дневники",
        user.name,
        "Hermit Diary",
      ],
      authors: [{ name: user.name }],
      creator: user.name,
      publisher: "Hermit Diary",
      openGraph: {
        title,
        description,
        type: "profile",
        url: `/user/${fetchedParams.user_code}`,
        siteName: "Hermit Diary",
        images: [
          {
            url: imageUrl,
            width: 400,
            height: 400,
            alt: `Аватар пользователя ${user.name}`,
          },
        ],
        locale: "ru_RU",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        "user-id": user.id.toString(),
        "user-name": user.name,
        "diaries-count": diaries.length.toString(),
      },
    };
  } catch (error) {
    return {
      title: "Профиль пользователя - Hermit Diary",
      description: "Профиль пользователя",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
