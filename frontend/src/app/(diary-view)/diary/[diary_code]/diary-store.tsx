"use client";

import {
  TabKey,
  ViewKey,
} from "@/app/(diary-view)/diary/[diary_code]/control-panel/diary-layout";
import {
  getDiary,
  getDiaryProperties,
  getDiaryWritePermission,
} from "@/services/methods/user/diaries";
import { getDiaryNote, getDiaryNotes } from "@/services/methods/user/notes";
import {
  defaultDiaryProperties,
  Diary,
  DiaryProperties,
} from "@/services/types/diary";
import { DiaryNote, VerboseNote } from "@/services/types/notes";
import React from "react";
import { createStore, StoreApi, useStore } from "zustand";

export type DiaryProps = Diary & {
  writePermission: boolean;
  properties: DiaryProperties;
  loaded: boolean;
  loadDiary: (diaryId: number) => Promise<void>;
  loadNotes: () => Promise<void>;
  forceUpdateNotes: () => void;
  loadProperties: () => Promise<void>;
  currentTab: TabKey;
  setCurrentTab: (key: TabKey) => void;
  currentView: ViewKey;
  setCurrentView: (key: ViewKey) => void;
  notes: DiaryNote[];
  selectedNote: DiaryNote | null;
  setSelectedNote: (note: DiaryNote | null) => void;
};

export const defaultDiary: Diary = {
  id: -1,
  isPublic: true,
  name: "untitled",
  picture: "",
  createdAt: "",
  updatedAt: "",
};

const createDiaryStore = () => {
  return createStore<DiaryProps>((set, get) => ({
    ...defaultDiary,
    ...{
      properties: defaultDiaryProperties,
      selectedNote: null,
      setSelectedNote(note) {
        set({ selectedNote: note });
      },
      writePermission: false,
      loaded: false,
      notes: [],
      currentTab: "tree",
      setCurrentTab(tab) {
        set({ currentTab: tab });
      },
      currentView: "graph",
      setCurrentView(view) {
        set({ currentView: view });
      },
      forceUpdateNotes() {
        set({ notes: [...get().notes] });
      },
      async loadDiary(diaryId) {
        try {
          const diary = await getDiary(diaryId);
          const writePermission = await getDiaryWritePermission(diaryId);
          const notes = await getDiaryNotes(diary.id);
          const properties = await getDiaryProperties(diary.id);
          let selectedNote = get().selectedNote;
          if (selectedNote) {
            let newNoteSelection = notes.filter(
              (note) => note.id == selectedNote?.id,
            );
            if (newNoteSelection.length > 0) selectedNote = newNoteSelection[0];
            else selectedNote = null;
          }
          set({
            ...diary,
            notes,
            writePermission,
            properties: { ...defaultDiaryProperties, ...properties },
            loaded: true,
            selectedNote: selectedNote,
          });
        } catch (e) {
          set({ loaded: true });
        }
      },
      async loadNotes() {
        try {
          const notes = await getDiaryNotes(get().id);
          set({ notes });
        } catch (e) {}
      },
      async loadProperties() {
        try {
          const properties = await getDiaryProperties(get().id);
          set({ properties: { ...defaultDiaryProperties, ...properties } });
        } catch (e) {
          console.error("Failed to load diary properties:", e);
        }
      },
    },
  }));
};
export type HeaderStore = ReturnType<typeof createDiaryStore>;

const DiaryStoreContext = React.createContext<HeaderStore | null>(null);

export function DiaryStoreProvider({ children }: React.PropsWithChildren) {
  const [state] = React.useState(() => createDiaryStore());
  return (
    <DiaryStoreContext.Provider value={state}>
      {children}
    </DiaryStoreContext.Provider>
  );
}

export function useDiaryStore<T>(selector: (state: DiaryProps) => T): T {
  const store = React.useContext(DiaryStoreContext);
  if (!store) throw new Error("Missing DiaryStoreContext.Provider in the tree");
  return useStore(store, selector);
}

export function useDiaryNote(noteId: number | undefined, dependencies: any[]) {
  const [note, setNote] = React.useState<VerboseNote | null>(null);

  const loadNote = React.useCallback(async () => {
    if (!noteId) return;
    const fetchedNote = await getDiaryNote(noteId);
    setNote(fetchedNote);
  }, [noteId]);

  React.useEffect(() => {
    loadNote();
  }, [loadNote, ...dependencies]);

  return { note };
}
