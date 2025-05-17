"use client";

import { useToast } from "@/hooks/use-toast";
import { addUserDiary, getUserDiaries } from "@/services/methods/user/diaries";
import { Diary } from "@/services/types/diary";
import React from "react";

export function useUserDiaries(userId: number | undefined) {
  const [diaries, setDiaries] = React.useState<Diary[]>([]);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const { toast } = useToast();

  const loadDiaries = React.useCallback(async () => {
    if (userId !== undefined) {
      setIsLoaded(false);
      const diaries = await getUserDiaries(userId);
      setDiaries(diaries);
      setIsLoaded(true);
    }
  }, [userId]);

  const addDiary = React.useCallback(async () => {
    if (userId !== undefined) {
      const diary = await addUserDiary(userId);
      if (diary) toast({ title: "Done!", description: "added new diary" });
      await loadDiaries();
    }
  }, [userId]);

  React.useEffect(() => {
    loadDiaries();
  }, [loadDiaries]);

  return { diaries, loadDiaries, addDiary, isLoaded };
}
