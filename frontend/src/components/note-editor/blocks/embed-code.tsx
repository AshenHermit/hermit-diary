"use client";

import {
  createReactBlockSpec,
  ReactCustomBlockRenderProps,
  ResizableFileBlockWrapper,
} from "@blocknote/react";
import { NotePicker } from "@/components/controls/note-picker";
import { Button } from "@/components/ui/button";
import { DiaryNote } from "@/services/types/notes";
import {
  defaultProps,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  filterSuggestionItems,
  PropSchema,
} from "@blocknote/core";
import { EditIcon, ImageIcon } from "lucide-react";
import { ResizableBlockWrapper } from "@/components/note-editor/blocks/helpers/resisable-block-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import classNames from "classnames";
import { EmbedBlockEditControl } from "@/components/controls/embed-code-edit-control";

export type EmbedBlockConfig = {
  type: string;
  readonly propSchema: PropSchema & {
    textAlignment: typeof defaultProps.textAlignment;
    textColor: typeof defaultProps.textColor;
    embedCode: {
      default: undefined;
      type: "string";
    };
    showPreview?: {
      default: boolean;
    };
    previewWidth?: {
      default: undefined;
      type: "number";
    };
  };
  content: "none";
};
export function EmbedBlockComponent(
  props: Omit<
    ReactCustomBlockRenderProps<EmbedBlockConfig, any, any>,
    "contentRef"
  >,
) {
  const applyEmbeddingCode = React.useCallback(
    (code: string) => {
      props.editor.updateBlock(props.block, {
        props: { embedCode: code as any },
      });
    },
    [props.block, props.editor],
  );

  return (
    <div className="relative min-h-32 w-full rounded-lg bg-muted">
      <div
        className="iframe-container w-full"
        dangerouslySetInnerHTML={{ __html: props.block.props.embedCode }}
      ></div>
      <EmbedBlockEditControl
        initValue={props.block.props.embedCode}
        onApply={applyEmbeddingCode}
      >
        {() => (
          <Button
            className={classNames(
              "absolute left-2 top-2 h-8 w-8 bg-muted/80 p-0",
              {
                hidden: !props.editor.isEditable,
              },
            )}
            variant={"ghost"}
          >
            <EditIcon />
          </Button>
        )}
      </EmbedBlockEditControl>
    </div>
  );
}

export const createEmbedBlock = () => ({
  spec: createReactBlockSpec(
    {
      type: "embed",
      propSchema: {
        textAlignment: defaultProps.textAlignment,
        textColor: defaultProps.textColor,
        embedCode: {
          default: undefined,
          type: "string",
        },
        showPreview: {
          default: true,
        },
        // File preview width in px.
        previewWidth: {
          default: undefined,
          type: "number",
        },
      },
      content: "none",
    },
    {
      render: (props) => (
        <ResizableBlockWrapper {...(props as any)}>
          <EmbedBlockComponent {...(props as any)} />
        </ResizableBlockWrapper>
      ),
    },
  ),
});
