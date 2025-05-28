"use client";
import { createEditorSchema } from "@/components/note-editor/blocknote-schema";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { RichContentData } from "@/services/types/notes";
import { useLoadingManager } from "@/store/loading-store";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import debounce from "just-debounce-it";
import React from "react";

export type RichContentEditorProps = {
  readOnly?: boolean;
  defaultValue: RichContentData | null;
  onDebouncedSave?: (data: RichContentData) => Promise<void>;
  className?: string;
  diaryId?: number;
  onNoteLinkUsed?: (noteId: number) => void;
};

export default function RichContentEditor({
  defaultValue,
  onDebouncedSave,
  readOnly,
  className,
  diaryId,
  onNoteLinkUsed,
}: RichContentEditorProps) {
  const [blocks, setBlocks] = React.useState<Record<string, any>[]>(
    defaultValue?.blocks ? defaultValue?.blocks : [],
  );

  const { schema, suggestionMenuProcessor } = React.useMemo(
    () => createEditorSchema({ diaryId, onNoteLinkUsed }),
    [diaryId],
  );
  const editor = useCreateBlockNote({
    schema: schema,

    initialContent: Array.isArray(defaultValue?.blocks)
      ? defaultValue?.blocks
      : undefined,
  });

  const { loading, error, handleRequest } = useRequestHandler();
  const { startTask, endTask } = useLoadingManager();

  const handleDebounceChange = React.useMemo(
    () =>
      debounce((data: any) => {
        handleRequest(async () => {
          startTask("content_save");
          if (onDebouncedSave) await onDebouncedSave({ blocks: data });
          endTask("content_save");
        });
      }, 500),
    [onDebouncedSave],
  );

  const onChange = React.useCallback(() => {
    handleDebounceChange(editor.document);
    setBlocks(editor.document);
  }, [editor]);

  const [html, setHTML] = React.useState<string | null>(null);
  React.useEffect(() => {
    (async () => {
      if (blocks && readOnly) {
        const buildedHtml = await editor.blocksToFullHTML(blocks);
        setHTML(buildedHtml);
      }
    })();
  }, [blocks]);

  // if (html && readOnly) {
  //   return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // }

  return (
    <BlockNoteView editable={!readOnly} editor={editor} onChange={onChange}>
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={suggestionMenuProcessor(editor)}
      />
    </BlockNoteView>
  );
}
