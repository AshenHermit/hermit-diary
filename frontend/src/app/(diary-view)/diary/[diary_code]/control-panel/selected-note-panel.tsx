"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import {
  useDiaryNote,
  useDiaryStore,
} from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { NoteFrame } from "@/components/note-editor/note-frame";
import { useNoteStore } from "@/components/note-editor/note-store";
import {
  OptionSchema,
  PropertiesEditor,
  PropTypes,
} from "@/components/props-editor/props-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { useToast } from "@/hooks/use-toast";
import { updateDiaryNote } from "@/services/methods/user/notes";
import {
  defaultNoteProperties,
  DiaryNote,
  NoteBase,
  NoteProperties,
} from "@/services/types/notes";
import { useViewsStore } from "@/store/views-store";
import debounce from "just-debounce-it";
import { ArrowDownRight, ArrowUpLeft, BoltIcon, LinkIcon } from "lucide-react";
import React from "react";

export function SelectedNotePanel() {
  const loadNotes = useDiaryStore((state) => state.loadNotes);
  const forceUpdateNotes = useDiaryStore((state) => state.forceUpdateNotes);
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const notes = useDiaryStore((state) => state.notes);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const [editMode, setEditMode] = React.useState(false);
  const { note } = useDiaryNote(selectedNote?.id, [notes]);

  const forceUpdate = React.useCallback(() => {
    forceUpdateNotes();
  }, [forceUpdateNotes]);

  if (!selectedNote) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          no note selected
        </div>
      </DiaryTabPanel>
    );
  }

  if (selectedNote && !note) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      </DiaryTabPanel>
    );
  }

  const onLink = (noteId: number) => {
    const foundNote = notes.filter((x) => x.id == noteId)[0];
    if (foundNote) setSelectedNote(foundNote);
  };

  if (note) {
    return (
      <DiaryTabPanel className="grid h-full grid-rows-[1fr_auto]">
        <NoteFrame
          note={note}
          config={{
            canEdit: writePermission,
            onNoteUpdate: () => loadNotes(),
            editMode,
            defaultEditMode: editMode,
            setEditMode,
            onNoteLinkUsed: onLink,
            classNames: {
              title: "!text-2xl font-bold",
            },
          }}
        />
        <Accordion type="multiple">
          <AccordionItem value="references">
            <AccordionTrigger>
              <LinkIcon /> References
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {note.incomingLinks.length > 0 ? (
                <div className="flex items-center gap-2 text-base text-white">
                  <ArrowDownRight /> Incoming links
                </div>
              ) : null}
              {note.incomingLinks.map((x) => (
                <ReferenceLink
                  key={x.id}
                  note={x}
                  onClick={() => onLink(x.id)}
                />
              ))}
              <hr />
              {note.outcomingLinks.length > 0 ? (
                <div className="flex items-center gap-2 text-base text-white">
                  <ArrowUpLeft /> Outgoing links
                </div>
              ) : null}
              {note.outcomingLinks.map((x) => (
                <ReferenceLink
                  key={x.id}
                  note={x}
                  onClick={() => onLink(x.id)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="properties">
            <AccordionTrigger>
              <BoltIcon /> Properties
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pt-2">
              <PropertiesSection
                note={selectedNote}
                forceUpdate={forceUpdate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DiaryTabPanel>
    );
  }

  return null;
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

function useNotePropsOptions() {
  const timeCircleView = useViewsStore((state) => state.timeCircleView);
  const notePropsOptionsBuilder = React.useCallback(
    () =>
      ({
        color: {
          title: "Color",
          description: "change color",
          key: "color",
          type: PropTypes.color,
          forceUpdate: true,
          default: defaultNoteProperties.color,
        },
        circleType: {
          title: "Circle type",
          description: "change circle type",
          key: "circleType",
          type: PropTypes.circleType,
          forceUpdate: true,
          default: defaultNoteProperties.circleType,
        },
        size: {
          title: "Circle size",
          description: "change circle size",
          key: "size",
          type: PropTypes.numberSlider,
          props: { min: 4, max: 100, factor: 0.25 },
          default: defaultNoteProperties.size,
        },
        timePosition: {
          title: "Circle time position",
          description: "set time position",
          key: "timePosition",
          type: PropTypes.numberSlider,
          props: { factor: 0.01, noInput: true },
          default: () =>
            timeCircleView ? timeCircleView.state.current.viewPosition : 0,
        },
      }) as Record<keyof NoteProperties, OptionSchema<any>>,
    [],
  );
  return notePropsOptionsBuilder();
}

function PropertiesSection({
  note,
  forceUpdate,
}: {
  note: NoteBase;
  forceUpdate?: () => void;
}) {
  const options = useNotePropsOptions();
  const { toast } = useToast();
  const writePermission = useDiaryStore((state) => state.writePermission);
  const selectedNote = useDiaryStore((state) => state.selectedNote);

  const { loading, error, handleRequest } = useRequestHandler();

  const saveProperties = React.useCallback(
    async (value: NoteProperties) => {
      handleRequest(async () => {
        await updateDiaryNote({ id: note.id, properties: value });
        toast({ title: "Saved!", description: "settings saved" });
        if (forceUpdate) forceUpdate();
      });
    },
    [note, handleRequest, toast, forceUpdate],
  );

  const handleDebounceChange = React.useMemo(
    () => debounce(saveProperties, 500),
    [saveProperties],
  );

  const onChange = (value: NoteProperties) => {
    handleDebounceChange({ ...value });
    if (selectedNote) {
      for (let key of Object.keys(value) as (keyof NoteProperties)[]) {
        if (value[key] === null) {
          delete value[key];
        }
      }
      selectedNote.properties = value;
    }
  };

  return (
    <div>
      <PropertiesEditor
        forceUpdate={forceUpdate}
        onValueChange={onChange}
        options={options}
        value={note.properties}
        key={note.id}
        editMode={writePermission}
      />
    </div>
  );
}
