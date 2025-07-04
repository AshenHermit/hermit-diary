import { Diary } from "@/services/types/diary";
import {
  Artefact,
  ArtefactUpdateDTO,
  DiaryNote,
  VerboseNote,
} from "@/services/types/notes";
import { apiClient } from "@/services/api-client/client-api";
import { NoteSearchResult } from "@/services/types/search";

export async function addDiaryNote(diaryId: number) {
  return await apiClient.post<DiaryNote, {}>(`diaries/${diaryId}/notes`);
}

export async function getDiaryNotes(diaryId: number) {
  return await apiClient.get<DiaryNote[], {}>(`notes`, {
    diaryId: diaryId,
  });
}

export async function searchNotes(params: {
  q: string;
  tags: string[];
  page: number;
  perPage: number;
}) {
  return await apiClient.get<NoteSearchResult, {}>(`notes/search`, {
    q: params.q,
    tags: params.tags.join(","),
    page: params.page,
    perPage: params.perPage,
  });
}

export async function searchNotesInDiary(
  params: {
    q: string;
    tags: string[];
    page: number;
    perPage: number;
  },
  diaryId: number,
) {
  return await apiClient.get<NoteSearchResult, {}>(
    `diaries/${diaryId}/notes/search`,
    {
      q: params.q,
      tags: params.tags.join(","),
      page: params.page,
      perPage: params.perPage,
    },
  );
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

export async function addNoteArtefact(
  noteId: number,
  data: Partial<ArtefactUpdateDTO>,
) {
  return await apiClient.post<Artefact, Partial<ArtefactUpdateDTO>>(
    `notes/${noteId}/artefacts`,
    data,
  );
}

export async function updateNoteArtefact(
  noteId: number,
  artefactId: number,
  data: Partial<ArtefactUpdateDTO>,
) {
  return await apiClient.patch<boolean, Partial<ArtefactUpdateDTO>>(
    `notes/${noteId}/artefacts/${artefactId}`,
    data,
  );
}

export async function deleteNoteArtefact(noteId: number, artefactId: number) {
  return await apiClient.delete<boolean, {}>(
    `notes/${noteId}/artefacts/${artefactId}`,
  );
}
