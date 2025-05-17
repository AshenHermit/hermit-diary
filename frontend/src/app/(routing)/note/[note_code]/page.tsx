import { NoteView } from "@/app/(routing)/note/[note_code]/note-view";
import { DiaryStylesApplier } from "@/components/controls/diary-styles-applier";
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
    <div className="flex h-full flex-col items-center justify-center">
      <div className="min-h-[80vh] min-w-[1200px] rounded-2xl bg-background p-8">
        <NoteView serverNote={note} noteId={noteId} />
        <DiaryStylesApplier properties={properties} />
      </div>
    </div>
  );
}
