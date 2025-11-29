"use client";

import { decodeId } from "@/lib/hash-utils";
import * as NotesAPI from "@/services/methods/user/notes";
import React from "react";
import { useDiaryStore } from "./diary-store";

export function ConsoleApi() {
  const diaryStore = useDiaryStore((state) => state);
  React.useEffect(() => {
    const api = {
      notes: {
        ...NotesAPI,
      },
      diaryStore,
      decodeId,
    };
    (window as any).api = api;
  }, [diaryStore]);
  return null;
}
