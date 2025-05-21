"use client";

import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NotesGraph } from "@/components/visualization/notes-graph/notes-graph";
import {
  NoteCircleStateRef,
  TimeCircle,
  TimeCircleApi,
  useCreateTimeCircleState,
} from "@/components/visualization/time-circle/time-circle";
import { addDiaryNote, updateDiaryNote } from "@/services/methods/user/notes";
import { DiaryNote } from "@/services/types/notes";
import { useViewsStore } from "@/store/views-store";
import {
  CirclePlusIcon,
  EyeOffIcon,
  MousePointer2Icon,
  Trash2Icon,
} from "lucide-react";
import React from "react";

export default function Page() {
  const notes = useDiaryStore((state) => state.notes);
  const activeNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);
  const properties = useDiaryStore((state) => state.properties);

  const diaryId = useDiaryStore((state) => state.id);
  const loadNotes = useDiaryStore((state) => state.loadNotes);

  const currentView = useDiaryStore((state) => state.currentView);

  const onSelectedNote = (note: DiaryNote) => {
    setSelectedNote(note);
    setCurrentTab("note");
  };

  const addNewNote = React.useCallback(async () => {
    let newNote = await addDiaryNote(diaryId);
    if (currentView == "time") {
      await updateDiaryNote({
        id: newNote.id,
        properties: { timePosition: timeCircleState.current.viewPosition },
      });
    }
    await loadNotes();
    onSelectedNote(newNote);
  }, [loadNotes, diaryId, currentView]);

  const setTimeCircleView = useViewsStore((state) => state.setTimeCircleView);
  const timeCircleState = useCreateTimeCircleState(notes);

  return (
    <ViewContextMenu onNoteAddRequest={addNewNote}>
      <div className="relative h-full w-full">
        {currentView == "graph" ? (
          <NotesGraph
            accentColor={properties.accentColor}
            notes={notes}
            onNoteSelected={onSelectedNote}
            activeNoteId={activeNote?.id}
          />
        ) : (
          <TimeCircle
            state={timeCircleState}
            accentColor={properties.accentColor}
            notes={notes}
            onNoteSelected={onSelectedNote}
            activeNoteId={activeNote?.id}
            ref={(api: TimeCircleApi | null) => {
              if (api) setTimeCircleView(api);
            }}
          />
        )}
      </div>
    </ViewContextMenu>
  );
}

function ViewContextMenu({
  onNoteAddRequest,
  children,
}: React.PropsWithChildren<{
  onNoteAddRequest: () => void;
}>) {
  const writePermission = useDiaryStore((state) => state.writePermission);

  if (!writePermission) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="cursor-pointer gap-2"
          onClick={onNoteAddRequest}
        >
          <CirclePlusIcon width={16} />
          Add new Note
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
