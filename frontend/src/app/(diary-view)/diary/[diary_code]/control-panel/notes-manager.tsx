"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import {
  ConfirmDialog,
  ConfirmDialogApi,
} from "@/components/controls/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { addDiaryNote, deleteDiaryNote } from "@/services/methods/user/notes";
import { DiaryNote } from "@/services/types/notes";
import { CirclePlusIcon, MousePointer2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function NotesManager() {
  const notes = useDiaryStore((state) => state.notes);
  return (
    <DiaryTabPanel className="h-full">
      <div className="text-lg font-semibold">Notes</div>
      <div className="flex h-full flex-col justify-stretch gap-1">
        {notes.map((note) => (
          <NoteItem note={note} key={note.id} />
        ))}
        <FreeSpaceArea />
      </div>
    </DiaryTabPanel>
  );
}

function NoteItem({ note }: { note: DiaryNote }) {
  const deletionDialogApi = React.useRef<ConfirmDialogApi>(null);

  const loadNotes = useDiaryStore((state) => state.loadNotes);

  const { loading, error, handleRequest } = useRequestHandler();

  const deleteNote = React.useCallback(async () => {
    handleRequest(async () => {
      await deleteDiaryNote(note);
      await loadNotes();
    });
  }, [note]);

  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const selectedNote = useDiaryStore((state) => state.selectedNote);

  const onClick = () => {
    setSelectedNote(note);
    setCurrentTab("note");
  };

  return (
    <>
      <ConfirmDialog
        apiRef={deletionDialogApi}
        onConfirm={deleteNote}
        title={"Удаление записи"}
        description={"Безвозвратно"}
        okContent={"Удалить"}
        cancelContent={"Отмена"}
        danger
      />
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant={"outline"}
            className={"w-full justify-between"}
            onClick={onClick}
          >
            {note.name}
            {note.id == selectedNote?.id ? <MousePointer2Icon /> : null}
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer gap-2 text-destructive"
            onClick={() => {
              deletionDialogApi.current?.open();
            }}
          >
            <Trash2Icon width={16} />
            Delete note
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}

function FreeSpaceArea() {
  const diaryId = useDiaryStore((state) => state.id);
  const loadNotes = useDiaryStore((state) => state.loadNotes);

  const addNewNote = React.useCallback(async () => {
    let newNote = await addDiaryNote(diaryId);
    await loadNotes();
  }, [loadNotes, diaryId]);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-full min-h-24 items-center justify-center rounded-xl bg-black"></ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer gap-2" onClick={addNewNote}>
          <CirclePlusIcon width={16} />
          Add new note
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
