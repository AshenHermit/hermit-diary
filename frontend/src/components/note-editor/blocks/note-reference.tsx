import { createReactBlockSpec } from "@blocknote/react";
import { NotePicker } from "@/components/controls/note-picker";
import { Button } from "@/components/ui/button";
import { DiaryNote } from "@/services/types/notes";
import {
  defaultProps,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  filterSuggestionItems,
} from "@blocknote/core";

function NoteReferenceComponent({
  readOnly,
  onChange,
  note,
  diaryId,
  onNoteLinkUsed,
}: {
  diaryId?: number;
  readOnly?: boolean;
  note?: DiaryNote;
  onChange: (value: DiaryNote) => void;
  onNoteLinkUsed?: (noteId: number) => void;
}) {
  if (readOnly) {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          note && onNoteLinkUsed ? onNoteLinkUsed(note.id) : undefined;
        }}
      >
        {note ? note.name : null}
      </Button>
    );
  }
  return (
    <div className="rounded-xl bg-secondary px-2">
      <NotePicker
        value={note ? note : null}
        onValueChange={(val) => {
          onChange(val);
        }}
        diaryId={diaryId}
      />
    </div>
  );
}

export const createNoteReferenceBlock = (
  diaryId?: number,
  onNoteLinkUsed?: (noteId: number) => void,
) => ({
  spec: createReactBlockSpec(
    {
      type: "noteReference",
      propSchema: {
        textAlignment: defaultProps.textAlignment,
        textColor: defaultProps.textColor,
        note: {
          default: undefined,
          type: "string",
        },
      },
      content: "none",
    },
    {
      render: (props) => (
        <NoteReferenceComponent
          onNoteLinkUsed={onNoteLinkUsed}
          readOnly={!props.editor.isEditable}
          note={
            props.block.props.note ? JSON.parse(props.block.props.note) : null
          }
          diaryId={diaryId}
          onChange={(val) => {
            props.editor.updateBlock(props.block, {
              props: { note: JSON.stringify(val) },
            });
          }}
        />
      ),
    },
  ),
});
