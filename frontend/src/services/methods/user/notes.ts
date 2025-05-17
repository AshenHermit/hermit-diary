import { Diary } from "@/services/types/diary";
import { DiaryNote, VerboseNote } from "@/services/types/notes";
import { apiClient } from "@services/api-client/client-api";

export async function addDiaryNote(diaryId: number) {
  return await apiClient.post<DiaryNote, {}>(`diaries/${diaryId}/notes`);
}

export async function getDiaryNotes(diaryId: number) {
  return await apiClient.get<DiaryNote[], {}>(`notes`, {
    diaryId: diaryId,
  });
}

export async function getNoteWritePermission(noteId: number) {
  return await apiClient.get<boolean, {}>(`notes/${noteId}/write_permission`);
}

export async function getDiaryNote(noteId: number) {
  return await apiClient.get<VerboseNote, {}>(`notes/${noteId}`);
}

export async function updateDiaryNote(note: Partial<VerboseNote>) {
  return await apiClient.patch<boolean, Partial<VerboseNote>>(
    `notes/${note.id}`,
    note,
  );
}

export async function deleteDiaryNote(note: DiaryNote) {
  return await apiClient.delete<boolean, {}>(`notes/${note.id}`);
}
