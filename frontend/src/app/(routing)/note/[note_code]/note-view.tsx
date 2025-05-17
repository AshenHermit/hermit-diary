"use client";

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
      <div className="grid h-full grid-cols-[200px_1px_1fr_1px_200px] gap-6">
        <div className="flex flex-col gap-2">
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
        <div className="bg-white opacity-20"></div>
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
        <div className="bg-white opacity-20"></div>
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
