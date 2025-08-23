import { RichContentData } from "@/services/types/notes";

export function getContentText(content?: RichContentData | null) {
  if (!content) return "";
  let descriptionText = "";
  if (content?.blocks) {
    content.blocks.forEach((block) => {
      if (block.type === "paragraph") {
        if (block.content) {
          block.content.forEach((blockContent: any) => {
            if (blockContent.type === "text") {
              descriptionText += blockContent.text as string;
            }
          });
        }
      }
    });
  }
  return descriptionText;
}
