import { Diary } from "@/services/types/diary";
import { DiaryNote, VerboseNote } from "@/services/types/notes";
import { apiClient } from "@services/api-client/server-api";

export async function getDiaryNote(noteId: number) {
  try {
    return await apiClient.get<VerboseNote, {}>(`notes/${noteId}`);
  } catch (e) {
    return null;
  }
}
