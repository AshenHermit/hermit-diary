import { NoteView } from "@/app/(routing)/note/[note_code]/note-view";
import { DiaryStylesApplier } from "@/components/controls/diary-styles-applier";
import { ContentBlockLayout } from "@/components/layout/content-block-layout";
import { decodeId } from "@/lib/hash-utils";
import { getDiaryProperties } from "@/services/methods/user/diaries";
import { getDiaryNote } from "@/services/methods/user/server-notes";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ note_code: string }>;
}) {
  const fetchedParams = await params;
  const noteId = decodeId("note", fetchedParams.note_code);
  const note = await getDiaryNote(noteId);
  let properties = {};
  if (note) {
    properties = await getDiaryProperties(note.diary.id);
  }

  return (
    <ContentBlockLayout>
      <NoteView serverNote={note} noteId={noteId} />
      <DiaryStylesApplier properties={properties} />
    </ContentBlockLayout>
  );
}
