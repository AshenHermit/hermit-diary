"use client";

import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { NotesGraph } from "@/components/visualization/notes-graph/notes-graph";
import {
  TimeCircle,
  TimeCircleApi,
  useTimeCircleState,
} from "@/components/visualization/time-circle/time-circle";
import { DiaryNote } from "@/services/types/notes";
import { useViewsStore } from "@/store/views-store";

export default function Page() {
  const notes = useDiaryStore((state) => state.notes);
  const activeNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);
  const properties = useDiaryStore((state) => state.properties);

  const currentView = useDiaryStore((state) => state.currentView);

  const onSelectedNote = (note: DiaryNote) => {
    setSelectedNote(note);
    setCurrentTab("note");
  };

  const setTimeCircleView = useViewsStore((state) => state.setTimeCircleView);
  const timeCircleState = useTimeCircleState(notes);

  return (
    <div className="relative">
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
  );
}
