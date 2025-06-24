"use client";

import {
  AddArtefactButton,
  ArtefactItem,
} from "@/app/(diary-view)/diary/[diary_code]/control-panel/artefacts-panel";
import { NoteFrame } from "@/components/note-editor/note-frame";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { encodeId } from "@/lib/hash-utils";
import { strToFormattedDateTime } from "@/lib/time-utils";
import {
  getDiaryNote,
  getNoteWritePermission,
} from "@/services/methods/user/notes";
import { NoteBase, VerboseNote } from "@/services/types/notes";
import { ArrowDownRight, ArrowUpLeft, InfoIcon, LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function NoteView({
  serverNote,
  noteId,
}: {
  serverNote: VerboseNote | null;
  noteId: number;
}) {
  const [note, setNote] = React.useState(serverNote);
  const [editMode, setEditMode] = React.useState(false);
  const [writePermission, setWritePermission] = React.useState(false);

  const router = useRouter();

  const checkWritePermission = React.useCallback(async () => {
    const permission = await getNoteWritePermission(noteId);
    setWritePermission(permission);
  }, [noteId]);

  const fetchNote = React.useCallback(async () => {
    const note = await getDiaryNote(noteId);
    setNote(note);
  }, [noteId]);

  React.useEffect(() => {
    checkWritePermission();
  }, [checkWritePermission]);

  React.useEffect(() => {
    if (!note) {
      fetchNote();
    }
  }, [fetchNote]);

  const onLink = React.useCallback((linkNoteId: number) => {
    router.push(`/note/${encodeId("note", linkNoteId)}`);
  }, []);

  if (!note) {
    return <div>no such note found</div>;
  }

  return (
    <>
      <EditModeLoader value={editMode} onValueChange={setEditMode} />
      <div className="flex flex-col gap-6">
        <div className="h-full grid-cols-[200px_1fr_200px] gap-6 max-md:flex max-md:grid-cols-1 max-md:grid-rows-[auto_auto_auto] max-md:flex-col md:grid">
          <div className="flex flex-col gap-2 max-md:order-3">
            {note.incomingLinks.length > 0 ? (
              <div className="flex items-center gap-2 text-base text-white">
                <ArrowDownRight /> Incoming links
              </div>
            ) : null}
            {note.incomingLinks.map((x) => (
              <ReferenceLink key={x.id} note={x} onClick={() => onLink(x.id)} />
            ))}
            <hr />
            {note.outcomingLinks.length > 0 ? (
              <div className="flex items-center gap-2 text-base text-white">
                <ArrowUpLeft /> Outgoing links
              </div>
            ) : null}
            {note.outcomingLinks.map((x) => (
              <ReferenceLink key={x.id} note={x} onClick={() => onLink(x.id)} />
            ))}
            <Accordion type="multiple">
              <AccordionItem value="info">
                <AccordionTrigger>
                  <InfoIcon /> Info
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs proportional-nums tracking-wide text-white opacity-50">
                    <div className="flex items-center justify-between">
                      <span>created at:</span>{" "}
                      <span className="w-min tabular-nums">
                        {strToFormattedDateTime(note.createdAt)}
                      </span>
                    </div>
                    <div className="text- flex items-center justify-between">
                      <span>updated at:</span>
                      <span className="w-min tabular-nums">
                        {strToFormattedDateTime(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="border-white/20 max-md:order-1 max-md:w-full max-md:border-b-[1px] max-md:py-4 md:border-x-[1px] md:px-4">
            <NoteFrame
              note={note}
              config={{
                canEdit: writePermission,
                onNoteUpdate: () => fetchNote(),
                editMode,
                defaultEditMode: editMode,
                setEditMode,
                onNoteLinkUsed: onLink,
                classNames: {
                  title: "!text-2xl font-bold",
                },
              }}
            />
          </div>
          <div className="max-md:order-3"></div>
        </div>
        <hr />
        <div className="grid gap-1 max-md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {note.artefacts
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((art) => (
              <ArtefactItem
                note={note}
                key={art.id}
                artefact={art}
                editable={writePermission && editMode}
                reloadNote={fetchNote}
              />
            ))}
          {writePermission && editMode ? (
            <AddArtefactButton note={note} reloadNote={fetchNote} />
          ) : null}
        </div>
      </div>
    </>
  );
}

function ReferenceLink({
  note,
  ...props
}: { note: NoteBase } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      size={"sm"}
      variant={"outline"}
      className="justify-start"
    >
      <LinkIcon />
      {note.name}
    </Button>
  );
}

function EditModeLoader({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
}) {
  const storageKey = "editMode";

  React.useEffect(() => {
    const lastNoteKey = localStorage.getItem(storageKey);
    if (lastNoteKey == "true") {
      onValueChange(true);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(storageKey, value ? "true" : "false");
  }, [value]);

  return null;
}
