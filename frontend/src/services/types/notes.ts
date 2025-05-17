import { Diary } from "@/services/types/diary";

export type NoteBase = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isPublic: boolean;
  properties: NoteProperties;
};

export type DiaryNote = NoteBase & {
  id: number;
  name: string;
  isPublic: boolean;
  incomingLinks: NoteBase[];
  outcomingLinks: NoteBase[];
};

export type GlobalNote = DiaryNote & {
  diary: Diary;
};

export type VerboseNote = GlobalNote & {
  content: Record<string, any>;
};

export type NoteProperties = {
  color?: string;
  circleType?: NoteCircleType;
  size?: number;
  timePosition?: number;
};

export const defaultNoteProperties: Omit<
  {
    [K in keyof NoteProperties]-?: NonNullable<NoteProperties[K]>;
  },
  "timePosition"
> & { timePosition: number | undefined } = {
  color: "#6f6f6f",
  circleType: "fill",
  size: 25,
  timePosition: undefined,
};

export function getNoteProps(note: NoteBase) {
  return { ...defaultNoteProperties, ...note.properties };
}

export type NoteCircleType = "fill" | "hollow" | "dashed";
