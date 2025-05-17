import { encodeId } from "@/lib/hash-utils";

export function makeLinkToDiary(diaryId: number) {
  return `/diary/${encodeId("diary", diaryId)}`;
}
