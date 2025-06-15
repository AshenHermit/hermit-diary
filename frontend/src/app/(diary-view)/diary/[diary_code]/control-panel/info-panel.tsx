"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { RichContentEditor } from "@/components/note-editor/dynamic-rich-content-editor";
import { UserBadge } from "@/components/profile-shortcut/profile-shortcut";
import Image from "next/image";

export function InfoPanel() {
  const title = useDiaryStore((state) => state.name);
  const description = useDiaryStore((state) => state.description);
  const user = useDiaryStore((state) => state.user);
  const properties = useDiaryStore((state) => state.properties);
  const diaryTab = useDiaryStore((state) => state.currentTab);

  return (
    <DiaryTabPanel className="!p-0">
      {properties.coverImage ? (
        <div>
          <Image
            width={468}
            height={150}
            src={properties.coverImage}
            alt="diary cover"
            className="h-[200px] w-full object-cover object-center"
          />
        </div>
      ) : null}
      <div className="p-4">
        <div>
          <UserBadge user={user} />
        </div>
        <div className="p-4 text-2xl font-bold">{title}</div>
        {diaryTab == "info" ? (
          <RichContentEditor
            defaultValue={description}
            readOnly
            key={JSON.stringify(description)}
          />
        ) : null}
      </div>
    </DiaryTabPanel>
  );
}
