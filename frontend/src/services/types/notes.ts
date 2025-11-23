import { Diary } from "@/services/types/diary";

export type NoteBase = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isPublic: boolean;
  parentNoteId: number | null;
  properties: NoteProperties;
};

export type DiaryNote = NoteBase & {
  id: number;
  name: string;
  isPublic: boolean;
  incomingLinks: NoteBase[];
  outcomingLinks: NoteBase[];
  diary?: Diary;
};

export type GlobalNote = DiaryNote & {
  diary: Diary;
};

export type RichContentData = {
  blocks: Record<string, any>[];
};

export type Artefact = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: RichContentData | null;
  embedCode: string | null;
};
export type ArtefactUpdateDTO = {
  content?: RichContentData | null;
  embedCode?: string | null;
  noteId?: number;
};

export type VerboseNote = GlobalNote & {
  content: RichContentData;
  artefacts: Artefact[];
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
