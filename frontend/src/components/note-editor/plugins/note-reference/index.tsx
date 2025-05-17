import { NoteReferenceElement } from "@/components/note-editor/plugins/note-reference/link";
import { YooptaPlugin } from "@yoopta/editor";
import { LinkIcon } from "lucide-react";

export const NoteReferencePlugin = new YooptaPlugin({
  type: "NoteReference",
  elements: {
    "note-reference": {
      render: NoteReferenceElement,
      props: {
        nodeType: "void",
      },
    },
  },
  options: {
    shortcuts: ["[["],
    display: {
      title: "NoteReference",
      description: "create link to other note",
      icon: <LinkIcon />,
    },
  },
});
