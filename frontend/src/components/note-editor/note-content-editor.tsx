"use client";

import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import "./styles.css";
import { useNoteStore } from "@/components/note-editor/note-store";
import YooptaEditor, {
  createYooptaEditor,
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
import { updateDiaryNote } from "@/services/methods/user/notes";
import { useToast } from "@/hooks/use-toast";
import { NoteReferencePlugin } from "@/components/note-editor/plugins/note-reference";

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

export function NoteContentEditor({ readOnly }: { readOnly?: boolean }) {
  const { toast } = useToast();
  const actualNote = useNoteStore((state) => state.note);
  const note = React.useMemo(() => actualNote, [actualNote.id]);
  const onNoteUpdate = useNoteStore((state) => state.onNoteUpdate);

  const editor = React.useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = React.useState<YooptaContentValue>(note.content);
  const selectionRef = React.useRef<HTMLDivElement>(null);

  const { loading, error, handleRequest } = useRequestHandler();

  const handleDebounceChange = React.useMemo(
    () =>
      debounce((data: any) => {
        handleRequest(async () => {
          let updateData = { id: note.id, content: data };
          await updateDiaryNote(updateData);
          if (onNoteUpdate) onNoteUpdate({ ...note, ...updateData });
          toast({ title: "Saved!", description: "note contents saved" });
        });
      }, 500),
    [note],
  );

  const onChange = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions,
  ) => {
    handleDebounceChange(value);
    setValue(value);
  };

  return (
    <div className="max-w-full px-8 text-foreground" ref={selectionRef}>
      <YooptaEditor
        readOnly={readOnly}
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        value={value}
        selectionBoxRoot={selectionRef}
        onChange={onChange}
        placeholder="type here..."
      />
    </div>
  );
}
