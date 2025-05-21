"use client";

import "./styles.css";
import { useNoteStore } from "@/components/note-editor/note-store";
import React from "react";
import { updateDiaryNote } from "@/services/methods/user/notes";
import { RichContentView } from "@/components/note-editor/rich-content-editor";

export function NoteContentEditor({ readOnly }: { readOnly?: boolean }) {
  const actualNote = useNoteStore((state) => state.note);
  const note = React.useMemo(() => actualNote, [actualNote.id]);
  const onNoteUpdate = useNoteStore((state) => state.onNoteUpdate);

  const handleDebouncedSave = React.useCallback(
    async (data: Record<string, any>) => {
      let updateData = { id: note.id, content: data };
      await updateDiaryNote(updateData);
      if (onNoteUpdate) onNoteUpdate({ ...note, ...updateData });
    },
    [note],
  );

  return (
    <RichContentView
      readOnly={readOnly}
      defaultValue={actualNote.content}
      onDebouncedSave={handleDebouncedSave}
      className="!pb-[100%]"
    />
  );
}
