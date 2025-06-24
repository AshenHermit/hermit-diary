"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import {
  useDiaryNote,
  useDiaryStore,
} from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { EmbedBlockEditControl } from "@/components/controls/embed-code-edit-control";
import { RichContentEditor } from "@/components/note-editor/dynamic-rich-content-editor";
import { UserBadge } from "@/components/profile-shortcut/profile-shortcut";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useRequestHandler } from "@/hooks/use-request-handler";
import {
  addNoteArtefact,
  deleteNoteArtefact,
  updateNoteArtefact,
} from "@/services/methods/user/notes";
import { Artefact, RichContentData, VerboseNote } from "@/services/types/notes";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

export function ArtefactsPanel() {
  const notes = useDiaryStore((state) => state.notes);
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const writePermission = useDiaryStore((state) => state.writePermission);
  const forceUpdateNotes = useDiaryStore((state) => state.forceUpdateNotes);

  const [editMode, setEditMode] = React.useState(writePermission);
  const { note, loadNote } = useDiaryNote(selectedNote?.id, [notes]);

  const updateNote = React.useCallback(async () => {
    await loadNote();
    forceUpdateNotes(notes);
  }, [notes]);

  return (
    <DiaryTabPanel className="">
      {note ? (
        <ArtefactsList
          note={note}
          editable={writePermission}
          reloadNote={updateNote}
        />
      ) : (
        <div className="text-center">no note selected</div>
      )}
    </DiaryTabPanel>
  );
}

export function ArtefactsList({
  note,
  editable,
  reloadNote,
}: {
  note: VerboseNote;
  editable: boolean;
  reloadNote: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-1">
      {note.artefacts
        .sort((a, b) => (a.id > b.id ? 1 : -1))
        .map((art) => (
          <ArtefactItem
            note={note}
            key={art.id}
            artefact={art}
            editable={editable}
            reloadNote={reloadNote}
          />
        ))}
      {editable ? (
        <AddArtefactButton note={note} reloadNote={reloadNote} />
      ) : null}
    </div>
  );
}

export function ArtefactItem({
  artefact,
  editable,
  reloadNote,
  note,
}: {
  artefact: Artefact;
  editable: boolean;
  reloadNote: () => Promise<void>;
  note: VerboseNote;
}) {
  const [embedCode, setEmbedCode] = React.useState(artefact.embedCode);

  const { loading, error, handleRequest } = useRequestHandler();

  const applyEmbeddingCode = React.useCallback(
    async (code: string) => {
      handleRequest(async () => {
        await updateNoteArtefact(note.id, artefact.id, { embedCode: code });
        await reloadNote();
      });
    },
    [artefact, reloadNote, note.id],
  );
  const deleteArtefact = React.useCallback(async () => {
    handleRequest(async () => {
      await deleteNoteArtefact(note.id, artefact.id);
      await reloadNote();
    });
  }, [artefact, reloadNote, note.id]);

  const onSaveContent = React.useCallback(
    async (data: RichContentData) => {
      await updateNoteArtefact(note.id, artefact.id, { content: data });
      await reloadNote();
    },
    [artefact, reloadNote, note.id],
  );

  const embed = React.useMemo(() => {
    if (!artefact.embedCode) return null;
    return (
      <div
        className="iframe-container min-h-[4px] w-full"
        dangerouslySetInnerHTML={{ __html: artefact.embedCode }}
      ></div>
    );
  }, [artefact.embedCode]);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted py-4">
      <div className="flex flex-col gap-2 px-4">
        {embed}
        {editable ? (
          <div className="flex items-center justify-between">
            <EmbedBlockEditControl
              onApply={applyEmbeddingCode}
              initValue={artefact.embedCode ?? ""}
            >
              {() => (
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  className="hover:bg-white/10"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <EditIcon />
                      edit embed
                    </>
                  )}
                </Button>
              )}
            </EmbedBlockEditControl>
            <Button
              size={"sm"}
              variant={"secondary"}
              className="hover:bg-white/10"
              onClick={deleteArtefact}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Trash2Icon />
                  delete
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
      <RichContentEditor
        trailingBlock={false}
        onDebouncedSave={onSaveContent}
        diaryId={note.diary.id}
        defaultValue={artefact.content}
        readOnly={!editable}
      />
    </div>
  );
}

export function AddArtefactButton({
  reloadNote,
  note,
}: {
  reloadNote: () => Promise<void>;
  note: VerboseNote;
}) {
  const { loading, error, handleRequest } = useRequestHandler();

  const addArtefact = React.useCallback(async () => {
    await handleRequest(async () => {
      await addNoteArtefact(note.id, {});
      await reloadNote();
    });
  }, [note.id]);

  return (
    <Button variant={"secondary"} onClick={addArtefact}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PlusIcon /> Add Artefact
        </>
      )}
    </Button>
  );
}

export function ArtefactBadge() {
  const notes = useDiaryStore((state) => state.notes);
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const writePermission = useDiaryStore((state) => state.writePermission);
  const { note, loadNote } = useDiaryNote(selectedNote?.id, [notes]);

  if (!note || note.artefacts.length == 0) return null;
  return (
    <>
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-center text-xs font-bold text-black max-md:-mt-3 md:-ml-3">
        {note.artefacts.length}
      </div>
    </>
  );
}
