import { Metadata } from "next";
import { decodeId } from "@/lib/hash-utils";
import { getDiaryNote } from "@/services/methods/user/server-notes";
import { getDiaryProperties } from "@/services/methods/user/diaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ note_code: string }>;
}): Promise<Metadata> {
  try {
    const fetchedParams = await params;
    const noteId = decodeId("note", fetchedParams.note_code);
    const note = await getDiaryNote(noteId);

    if (!note) {
      return {
        title: "Заметка не найдена - Hermit Diary",
        description: "Заметка не найдена или недоступна",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const properties = await getDiaryProperties(note.diary.id);

    const title = `${note.name} - ${note.diary.name} - Hermit Diary`;
    const description = `Заметка "${note.name}" из дневника ${note.diary.user.name}`;

    const imageUrl =
      properties.coverImage || note.diary.picture || "/textures/bg.png";

    return {
      title,
      description,
      keywords: [
        "заметка",
        "дневник",
        note.name,
        note.diary.name,
        note.diary.user.name,
      ],
      authors: [{ name: note.diary.user.name }],
      creator: note.diary.user.name,
      publisher: "Hermit Diary",
      openGraph: {
        title,
        description,
        type: "website",
        url: `/note/${fetchedParams.note_code}`,
        siteName: "Hermit Diary",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Заметка ${note.name} из дневника ${note.diary.name}`,
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
        index: note.isPublic && note.diary.isPublic,
        follow: note.isPublic && note.diary.isPublic,
      },
      other: {
        "note-id": note.id.toString(),
        "note-author": note.diary.user.name,
        "diary-name": note.diary.name,
        "note-created": note.createdAt,
        "note-updated": note.updatedAt,
      },
    };
  } catch (error) {
    return {
      title: "Заметка - Hermit Diary",
      description: "Заметка из дневника",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
