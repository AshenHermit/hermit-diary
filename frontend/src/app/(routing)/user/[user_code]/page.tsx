import { ContentBlockLayout } from "@/components/layout/content-block-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { decodeId } from "@/lib/hash-utils";
import { makeLinkToDiary } from "@/lib/url-utils";
import { getUserDiaries } from "@/services/methods/user/diaries";
import { getUser } from "@/services/methods/user/users-server";
import { Diary } from "@/services/types/diary";
import { CircleDotDashed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ user_code: string }>;
}) {
  const fetchedParams = await params;
  const userId = decodeId("user", fetchedParams.user_code);
  const user = await getUser(userId);
  const diaries = await getUserDiaries(userId);

  return (
    <ContentBlockLayout
      classesNames={{
        wrapper:
          "md:max-w-[1200px] flex flex-col items-center justify-center gap-4",
      }}
    >
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.picture}></AvatarImage>
      </Avatar>
      <div className="text-xl font-semibold">{user.name}</div>
      <hr />
      <div className="flex grid-cols-1 flex-wrap gap-4 max-md:grid max-md:w-full">
        {diaries.map((diary) => (
          <DiaryCard key={diary.id} diary={diary} />
        ))}
      </div>
    </ContentBlockLayout>
  );
}

function DiaryCard({
  diary,
  onUpdate,
}: {
  diary: Diary;
  onUpdate?: () => void;
}) {
  let picture = null;
  if (diary.properties && diary.properties.coverImage) {
    picture = diary.properties.coverImage;
  }

  return (
    <Link href={makeLinkToDiary(diary.id)}>
      <div className="grid h-[200px] grid-rows-[1fr_auto] overflow-hidden rounded-2xl bg-muted transition-all hover:scale-105 max-md:w-full md:min-w-[200px]">
        {picture ? (
          <Image
            src={picture}
            height={200}
            width={200}
            alt={diary.name}
            className="h-full min-h-0 w-full object-cover"
          />
        ) : (
          <div className="flex cursor-pointer items-center justify-center bg-sidebar">
            <CircleDotDashed />
          </div>
        )}
        <div className="border-t-2 border-gray-950 p-4">{diary.name}</div>
      </div>
    </Link>
  );
}
