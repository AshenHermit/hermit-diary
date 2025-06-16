"use client";

import { useNoteStore } from "@/components/note-editor/note-store";
import React from "react";
import { updateDiaryNote } from "@/services/methods/user/notes";
import { RichContentData } from "@/services/types/notes";
import RichContentEditor from "@/components/note-editor/rich-content-editor";

export function NoteContentEditor({ readOnly }: { readOnly?: boolean }) {
  const actualNote = useNoteStore((state) => state.note);
  const note = React.useMemo(() => actualNote, [actualNote.id]);
  const onNoteUpdate = useNoteStore((state) => state.onNoteUpdate);
  const onNoteLinkUsed = useNoteStore((state) => state.onNoteLinkUsed);

  const handleDebouncedSave = React.useCallback(
    async (data: RichContentData) => {
      console.log(data);
      note.content = data;
      let updateData = { id: note.id, content: data };
      await updateDiaryNote(updateData);
      if (onNoteUpdate) onNoteUpdate({ ...note, ...updateData });
    },
    [note],
  );

  return (
    <RichContentEditor
      onNoteLinkUsed={onNoteLinkUsed}
      diaryId={note.diary.id}
      readOnly={readOnly}
      defaultValue={actualNote.content}
      onDebouncedSave={handleDebouncedSave}
      className="!pb-[100%]"
    />
  );
}
