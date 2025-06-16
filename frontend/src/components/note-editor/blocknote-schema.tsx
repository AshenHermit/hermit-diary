import { createEmbedBlock } from "@/components/note-editor/blocks/embed-code";
import { createNoteReferenceBlock } from "@/components/note-editor/blocks/note-reference";
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
import { CodeIcon, LinkIcon } from "lucide-react";

export function createEditorSchema({
  diaryId,
  onNoteLinkUsed,
}: {
  diaryId?: number;
  onNoteLinkUsed?: (noteId: number) => void;
}) {
  const noteReferenceBlock = createNoteReferenceBlock(diaryId, onNoteLinkUsed);
  const embedBlock = createEmbedBlock();

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      noteReference: noteReferenceBlock.spec,
      embed: embedBlock.spec,
    },
  });

  const insertBlockEl = (
    editor: typeof schema.BlockNoteEditor,
    props: {
      id: keyof typeof schema.blockSchema;
      title: string;
      description: string;
      aliases: string[];
      icon: React.ReactElement;
    },
  ) => ({
    title: props.title,
    subtext: props.description,
    onItemClick: () =>
      // If the block containing the text caret is empty, `insertOrUpdateBlock`
      // changes its type to the provided block. Otherwise, it inserts the new
      // block below and moves the text caret to it. We use this function with an
      // Alert block.
      insertOrUpdateBlock(editor, {
        type: props.id,
      }),
    aliases: props.aliases,
    group: "Basic blocks",
    icon: props.icon,
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
      const blocksToInsert = [
        insertBlockEl(editor, {
          id: "noteReference",
          title: "Note Reference",
          description: "Create link to another note",
          aliases: ["diary", "link", "note", "ref", "reference"],
          icon: <LinkIcon />,
        }),
        insertBlockEl(editor, {
          id: "embed",
          title: "Embed Code",
          description: "Insert Embed Code",
          aliases: ["embed", "code", "video", "html"],
          icon: <CodeIcon />,
        }),
      ];
      defaultItems.splice(lastBasicBlockIndex + 1, 0, ...blocksToInsert);

      // Returns filtered items based on the query.
      return filterSuggestionItems(defaultItems, query);
    };
  };

  return { schema, suggestionMenuProcessor };
}
