"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import {
  ConfirmDialog,
  ConfirmDialogApi,
} from "@/components/controls/confirmation-dialog";
import {
  DragItem,
  DragItemsContainer,
} from "@/components/controls/drag-items-list";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  addDiaryNote,
  deleteDiaryNote,
  updateDiaryNote,
} from "@/services/methods/user/notes";
import { DiaryNote } from "@/services/types/notes";
import {
  ChevronsUpDownIcon,
  CirclePlusIcon,
  EyeOffIcon,
  MousePointer2Icon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type TreeItem = DiaryNote & {
  children: TreeItem[];
  getParentIds: () => number[];
  origNote: DiaryNote;
};

function buildTree(items: DiaryNote[]): TreeItem[] {
  const lookup: Record<number, TreeItem> = {};
  const roots: TreeItem[] = [];

  const getParentIds = (itemId: number) => {
    if (lookup[itemId].parentNoteId === null) return [];

    let parentId = lookup[itemId].parentNoteId;
    const ids = [];

    for (let i = 0; i < 20; i++) {
      ids.push(parentId);
      let parent = lookup[parentId];
      if (parent.parentNoteId !== null) {
        parentId = parent.parentNoteId;
      } else {
        break;
      }
    }
    return ids;
  };

  for (const item of items) {
    lookup[item.id] = {
      ...item,
      origNote: item,
      children: [],
      getParentIds: () => getParentIds(item.id),
    };
  }

  for (const item of items) {
    if (item.parentNoteId === null) {
      roots.push(lookup[item.id]);
    } else {
      const parent = lookup[item.parentNoteId];
      if (parent) {
        parent.children.push(lookup[item.id]);
      } else {
        roots.push(lookup[item.id]);
      }
    }
  }

  return roots;
}

export function NotesManager() {
  const notes = useDiaryStore((state) => state.notes);
  const treeRoots = buildTree(notes);

  return (
    <DiaryTabPanel className="h-full">
      <div className="text-lg font-semibold">Notes</div>
      <div className="flex h-full flex-col justify-stretch gap-1">
        <DragItemsContainer>
          <NoteTree treeItems={treeRoots} level={0} />
          {/* {notes.map((note) => (
            <NoteItem note={note} key={note.id} />
          ))} */}
          <FreeSpaceArea />
        </DragItemsContainer>
      </div>
    </DiaryTabPanel>
  );
}

export function NoteTree({
  treeItems,
  level,
}: {
  treeItems: TreeItem[];
  level: number;
}) {
  return treeItems.map((treeItem) => (
    <TreeItemComponent
      key={treeItem.id + " " + treeItems.length}
      level={level}
      treeItem={treeItem}
    />
  ));
}

function TreeItemComponent({
  treeItem,
  level,
}: {
  treeItem: TreeItem;
  level: number;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const reparentNote = useReparentNote();

  return (
    <div
      className="flex flex-col justify-stretch gap-1"
      key={treeItem.id}
      ref={itemRef}
    >
      <Collapsible className="w-[350px]">
        <DragItem
          data={treeItem}
          onDataDropped={(data) => reparentNote(data, treeItem)}
          itemRef={itemRef}
        >
          <NoteItem note={treeItem} style={{ marginLeft: level * 2 + "rem" }} />
        </DragItem>
        {treeItem.children.length > 0 ? (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        ) : null}
        <CollapsibleContent className="flex flex-col justify-stretch gap-1">
          {treeItem.children.length > 0 ? (
            <NoteTree level={level + 1} treeItems={treeItem.children} />
          ) : null}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function useReparentNote() {
  const notes = useDiaryStore((state) => state.notes);
  const loadNotes = useDiaryStore((state) => state.loadNotes);
  const forceUpdateNotes = useDiaryStore((state) => state.forceUpdateNotes);
  const { loading, error, handleRequest } = useRequestHandler();

  const reparentNote = (note: TreeItem, toNote: TreeItem | null) => {
    const toNoteId = toNote ? toNote.id : null;
    if (toNote !== null) {
      if (toNote.id == note.id) return;
      if (toNote.getParentIds().indexOf(note.id) != -1) return;
    }
    console.log(notes);
    const actualNote = notes.filter((x) => x.id == note.id)[0];
    console.log(actualNote);
    actualNote.parentNoteId = toNoteId;

    forceUpdateNotes(notes);
    handleRequest(async () => {
      await updateDiaryNote({ id: note.id, parentNoteId: toNoteId });
    });
  };

  return reparentNote;
}

function NoteItem({
  note,
  ...props
}: { note: TreeItem } & React.ComponentProps<"button">) {
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
            className={"justify-between"}
            onClick={onClick}
            {...props}
          >
            {note.name}
            <div className="flex gap-2">
              {!note.isPublic ? <EyeOffIcon /> : null}
              {note.id == selectedNote?.id ? <MousePointer2Icon /> : null}
            </div>
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

  const reparentNote = useReparentNote();

  return (
    <ContextMenu>
      <DragItem
        data={null}
        draggable={false}
        onDataDropped={(data) => reparentNote(data, null)}
      >
        <ContextMenuTrigger className="flex h-full min-h-24 items-center justify-center rounded-xl bg-black"></ContextMenuTrigger>
      </DragItem>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer gap-2" onClick={addNewNote}>
          <CirclePlusIcon width={16} />
          Add new note
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
