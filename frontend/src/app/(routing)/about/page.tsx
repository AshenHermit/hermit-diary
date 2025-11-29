import { ContentBlockLayout } from "@/components/layout/content-block-layout";
import { NoteContentEditor } from "@/components/note-editor/note-content-editor";
import RichContentEditor from "@/components/note-editor/rich-content-editor";
import { getDiaryNote } from "@/services/methods/user/notes";
import Link from "next/link";
import { Suspense } from "react";
import { metadata } from "./about-metadata";

export { metadata };

export default async function Page() {
  const note = await getDiaryNote(48);
  return (
    <ContentBlockLayout
      classesNames={{
        wrapper: "flex flex-col gap-4 md:max-w-[1000px] md:min-w-[1000px]",
      }}
    >
      <div className="text-lg font-semibold">About</div>
      <Suspense>
        <RichContentEditor
          diaryId={note.diary.id}
          defaultValue={note.content}
          readOnly
        />
      </Suspense>
    </ContentBlockLayout>
  );
}
