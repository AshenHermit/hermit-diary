"use client";

import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import "./styles.css";
import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import React from "react";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import ToolBar, { DefaultToolbarRender } from "@yoopta/toolbar";
import Divider from "@yoopta/divider";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Link from "@yoopta/link";
import Image from "@yoopta/image";
import Embed from "@yoopta/embed";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import { uploadFile } from "@/services/methods/files/upload-file";
import debounce from "just-debounce-it";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { useToast } from "@/hooks/use-toast";
import { NoteReferencePlugin } from "@/components/note-editor/plugins/note-reference";
import EventEmitter from "eventemitter3";
import {
  Bold,
  CodeMark,
  Highlight,
  Italic,
  Strike,
  Underline,
} from "@yoopta/marks";

export function createYooptaEditorUnique(): YooEditor {
  // Create a unique event emitter for each editor instance
  const eventEmitter = new EventEmitter();

  const Events = {
    on: (event: any, fn: any) => eventEmitter.on(event, fn),
    once: (event: any, fn: any) => eventEmitter.once(event, fn),
    off: (event: any, fn: any) => eventEmitter.off(event, fn),
    emit: (event: any, payload: any) => eventEmitter.emit(event, payload),
  };

  const editor = createYooptaEditor();

  editor.on = (event, callback) => Events.on(event, callback);
  editor.off = (event, callback) => Events.off(event, callback);
  editor.emit = (event, ...args) => Events.emit(event, ...args);
  editor.once = (event, callback) => Events.once(event, callback);

  return editor;
}

const plugins = [
  Paragraph,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Link,
  NoteReferencePlugin,
  Embed.extend({
    options: {
      maxSizes: {
        maxWidth: 400,
      },
    },
  }),
  Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadFile(file);

        return {
          src: data?.url,
          alt: data?.filePath,
          sizes: { height: 400, width: 400 },
        };
      },
    },
  }),
];
const TOOLS = {
  Toolbar: {
    tool: ToolBar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenuList,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export type RichContentEditorProps = {
  readOnly?: boolean;
  defaultValue: Record<string, any> | null;
  onDebouncedSave?: (data: Record<string, any>) => Promise<void>;
  className?: string;
};

export function RichContentView({
  readOnly,
  defaultValue,
  onDebouncedSave,
  className,
}: RichContentEditorProps) {
  const { toast } = useToast();

  const editor = React.useMemo(() => createYooptaEditorUnique(), []);
  // const defaultValue = defaultValue ? defaultValue
  const [value, setValue] = React.useState<YooptaContentValue | undefined>(
    defaultValue ? defaultValue : undefined,
  );
  const selectionRef = React.useRef<HTMLDivElement>(null);

  const { loading, error, handleRequest } = useRequestHandler();

  const handleDebounceChange = React.useMemo(
    () =>
      debounce((data: any) => {
        handleRequest(async () => {
          if (onDebouncedSave) await onDebouncedSave(data);
          toast({ title: "Saved!", description: "contents saved" });
        });
      }, 500),
    [onDebouncedSave],
  );

  const onChange = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions,
  ) => {
    options.operations.forEach((op) => {
      if (op.type == "set_block_value") {
        const block = editor.getBlock({ id: op.id });
        if (block?.value && block.type == "Paragraph") {
          if (block.value.length > 1) {
            const newValue = block.value.map((val, idx) => ({ ...val }));
            newValue.reverse().forEach((val) => {
              editor.insertBlock("Paragraph", {
                at: editor.path.current,
                blockData: { value: [val] as any },
              });
            });
            editor.deleteBlock({ blockId: block.id });
          }
        }
      }
    });
    if (options.operations) handleDebounceChange(value);
    setValue(value);
  };

  return (
    <div className="h-full max-w-full px-8 text-foreground" ref={selectionRef}>
      <YooptaEditor
        readOnly={readOnly}
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        value={value}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        onChange={onChange}
        className={className}
        placeholder="type here..."
      />
    </div>
  );
}
