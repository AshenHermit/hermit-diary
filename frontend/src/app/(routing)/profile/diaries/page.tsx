"use client";

import { HorizontalDivider } from "@/components/ui/horizontal-divider";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useUserDiaries } from "@/hooks/api-hooks";
import { makeLinkToDiary } from "@/lib/url-utils";
import { Diary } from "@/services/types/diary";
import { useUserStore } from "@/store/user-store";
import { CircleDotDashed, CircleFadingPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-4 p-8">
      <HorizontalDivider>Diaries</HorizontalDivider>
      <DiariesList />
    </div>
  );
}

function DiariesList() {
  const userLoaded = useUserStore((state) => state.loaded);
  const userId = useUserStore((state) => state.id);
  const { diaries, loadDiaries, addDiary, isLoaded } = useUserDiaries(
    userLoaded ? userId : undefined,
  );

  if (!isLoaded)
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-4">
      {diaries.map((diary) => (
        <DiaryCard diary={diary} />
      ))}
      <AddNewDiaryCard onClick={addDiary} />
    </div>
  );
}

function DiaryCard({
  diary,
  onUpdate,
}: {
  diary: Diary;
  onUpdate?: () => void;
}) {
  return (
    <Link href={makeLinkToDiary(diary.id)}>
      <div className="grid h-[200px] grid-rows-[1fr_auto] overflow-hidden rounded-2xl bg-muted transition-all hover:scale-105">
        <div className="flex cursor-pointer items-center justify-center bg-sidebar">
          <CircleDotDashed />
        </div>
        <div className="border-t-2 border-gray-950 p-4">{diary.name}</div>
      </div>
    </Link>
  );
}

function AddNewDiaryCard(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className="flex h-[200px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-muted text-muted transition-all hover:scale-105"
    >
      <CircleFadingPlus />
      <div>new diary</div>
    </div>
  );
}
