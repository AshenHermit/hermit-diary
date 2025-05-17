"use client";

import { VerboseNote } from "@/services/types/notes";
import React from "react";
import { createStore, useStore } from "zustand";

export type NoteStoreConfig = {
  canEdit?: boolean;
  defaultEditMode?: boolean;
  onNoteUpdate?: (note: VerboseNote) => void;
  editMode?: boolean;
  setEditMode?: (value: boolean) => void;
  onNoteLinkUsed?: (noteId: number) => void;
  classNames?: {
    title?: string;
  };
};

export type NoteStoreType = NoteStoreConfig & {
  canEdit?: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  note: VerboseNote;
  setNote: (note: VerboseNote) => void;
  defClassNames: NonNullable<NoteStoreConfig["classNames"]>;
};

const createNoteStore = (note: VerboseNote, config: NoteStoreConfig) => {
  return createStore<NoteStoreType>((set, get) => ({
    defClassNames: { title: "", ...config.classNames },
    ...config,
    ...{
      note: note,
      editMode: config.defaultEditMode ?? false,
      setEditMode: config.setEditMode
        ? config.setEditMode
        : (value) => {
            set({ editMode: value });
          },
      setNote(note) {
        set({ note });
        const onUpdate = get().onNoteUpdate;
        if (onUpdate) onUpdate(note);
      },
    },
  }));
};
export type HeaderStore = ReturnType<typeof createNoteStore>;

const NoteStoreContext = React.createContext<HeaderStore | null>(null);

export function NoteStoreProvider({
  children,
  note,
  ...config
}: React.PropsWithChildren<NoteStoreConfig & { note: VerboseNote }>) {
  const state = React.useMemo(
    () => createNoteStore(note, config),
    [note.id, config],
  );

  return (
    <NoteStoreContext.Provider value={state}>
      {children}
    </NoteStoreContext.Provider>
  );
}

export function useNoteStore<T>(selector: (state: NoteStoreType) => T): T {
  const store = React.useContext(NoteStoreContext);
  if (!store) throw new Error("Missing NoteStoreContext.Provider in the tree");
  return useStore(store, selector);
}
