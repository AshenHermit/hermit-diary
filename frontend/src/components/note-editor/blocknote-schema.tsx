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
import {
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { LinkIcon } from "lucide-react";

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

export function createEditorSchema({
  diaryId,
  onNoteLinkUsed,
}: {
  diaryId?: number;
  onNoteLinkUsed?: (noteId: number) => void;
}) {
  const noteReferenceBlock = createReactBlockSpec(
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
  );

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      noteReference: noteReferenceBlock,
    },
  });

  const insertNoteRef = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Note Reference",
    subtext: "Create link to another note",
    onItemClick: () =>
      // If the block containing the text caret is empty, `insertOrUpdateBlock`
      // changes its type to the provided block. Otherwise, it inserts the new
      // block below and moves the text caret to it. We use this function with an
      // Alert block.
      insertOrUpdateBlock(editor, {
        type: "noteReference",
      }),
    aliases: ["diary", "link", "note", "ref", "reference"],
    group: "Basic blocks",
    icon: <LinkIcon />,
  });

  const suggestionMenuProcessor = (editor: typeof schema.BlockNoteEditor) => {
    return async (query: string) => {
      // Gets all default slash menu items.
      const defaultItems = getDefaultReactSlashMenuItems(editor);
      // Finds index of last item in "Basic blocks" group.
      const lastBasicBlockIndex = defaultItems.findLastIndex(
        (item) => item.group === "Basic blocks",
      );
      // Inserts the Alert item as the last item in the "Basic blocks" group.
      defaultItems.splice(lastBasicBlockIndex + 1, 0, insertNoteRef(editor));

      // Returns filtered items based on the query.
      return filterSuggestionItems(defaultItems, query);
    };
  };

  return { schema, suggestionMenuProcessor };
}
