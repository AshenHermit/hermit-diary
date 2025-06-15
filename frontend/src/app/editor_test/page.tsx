"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import React from "react";

export default function Page() {
  const editor = useCreateBlockNote();

  React.useEffect(() => {
    editor.onChange((editor, { getChanges }) => {
      console.log("Editor updated");
      const changes = getChanges();
      console.log(changes);
    });
  }, []);

  React.useEffect(() => {
    const editable = document.querySelector(
      "[contenteditable='true']",
    ) as HTMLDivElement;
    if (!editable) return;

    const handler = (e: InputEvent) => {
      console.log(e);
      if (e.inputType === "deleteContentBackward") {
        const pos = editor.getTextCursorPosition();
        // editor.removeBlocks([pos.block.id]);
        if (!pos.block.content) {
        }
        return;
      }
    };

    editable.addEventListener("beforeinput", handler);
    return () => {
      editable.removeEventListener("beforeinput", handler);
    };
  }, []);

  return <BlockNoteView editor={editor}></BlockNoteView>;
}
