import { NotePicker } from "@/components/controls/note-picker";
import { useNoteStore } from "@/components/note-editor/note-store";
import { Button } from "@/components/ui/button";
import { DiaryNote } from "@/services/types/notes";
import {
  Elements,
  PluginElementRenderProps,
  useYooptaEditor,
  useYooptaReadOnly,
} from "@yoopta/editor";
import React from "react";

export function NoteReferenceElement({
  attributes,
  children,
  element,
  blockId,
}: PluginElementRenderProps) {
  const editor = useYooptaEditor();
  const readonly = useYooptaReadOnly();

  const note = useNoteStore((state) => state.note);
  const onNoteLinkUsed = useNoteStore((state) => state.onNoteLinkUsed);
  const [value, setValue] = React.useState<DiaryNote | null>(null);

  const elProps = element.props as any;

  const onValueChange = (value: DiaryNote) => {
    const elementPath = Elements.getElementPath(editor, blockId, element);
    Elements.updateElement(
      editor,
      blockId,
      { type: "note-reference", props: { ...element.props, note: value } },
      { path: elementPath },
    );
  };

  if (readonly) {
    return (
      <Button
        variant="secondary"
        onClick={
          onNoteLinkUsed
            ? () => {
                onNoteLinkUsed(elProps.note.id);
              }
            : undefined
        }
      >
        {elProps.note ? elProps.note.name : null}
      </Button>
    );
  }

  return (
    <div
      {...attributes}
      className="yoopta-note-reference mb-[6px] w-max rounded-lg bg-muted p-1 text-sm text-muted-foreground"
      contentEditable={false}
    >
      <div className=""></div>
      <NotePicker
        diaryId={note.diary.id}
        value={elProps.note ? elProps.note : null}
        onValueChange={onValueChange}
      />
    </div>
  );
}
