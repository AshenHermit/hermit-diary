"use client";

import { NoteCircle } from "@/components/visualization/notes-graph/NoteCircle";
import {
  defaultWorldSettings,
  NotesGraphWorld,
} from "@/components/visualization/notes-graph/NotesGraphWorld";
import { StageView } from "@/components/visualization/stage-view";
import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import React, { forwardRef } from "react";
import { Circle, Group, Layer, Stage, Text } from "react-konva";

export type NotesGraphProps = {
  notes: DiaryNote[];
  onNoteSelected: (note: DiaryNote) => void;
  activeNoteId?: number | null;
  accentColor?: string;
};

export function NotesGraph({
  notes,
  onNoteSelected,
  activeNoteId,
  accentColor = "#ffac59",
}: NotesGraphProps) {
  return (
    <StageView>
      <Layer>
        <NotesGraphWorld
          updateDeps={notes}
          worldSettings={defaultWorldSettings}
        >
          {notes.map((note) => (
            <NoteCircle
              accentColor={accentColor}
              key={note.id}
              note={note}
              active={note.id == activeNoteId}
              onSelected={onNoteSelected}
            />
          ))}
        </NotesGraphWorld>
      </Layer>
    </StageView>
  );
}
