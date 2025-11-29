"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CircleDotDashedIcon,
  LightbulbIcon,
  ScanSearchIcon,
} from "lucide-react";
import NotesSearch from "@/components/layout/search";
import Link from "next/link";
import FeedbackWidget from "@/components/controls/fast-feedback";

export function MainPageClientContent() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <NotesSearch open={searchOpen} setOpen={setSearchOpen} />
      <Button
        onClick={() => setSearchOpen(true)}
        size={"lg"}
        className="rounded-xl bg-[#6d2d2e] p-8 text-lg"
      >
        <ScanSearchIcon className="!size-6" /> Search Notes
      </Button>
      <Link href="/profile/diaries">
        <Button
          size={"lg"}
          className="w-full rounded-xl bg-[#a99079] p-8 text-lg"
        >
          <CircleDotDashedIcon className="!size-6" /> Go to My Diaries
        </Button>
      </Link>
      <Link
        href="https://github.com/AshenHermit/hermit-diary/issues/new"
        target="_blank"
      >
        <Button
          size={"lg"}
          variant={"secondary"}
          className="w-full rounded-xl bg-[#0b0a0f] p-8 text-lg text-white"
        >
          <LightbulbIcon className="!size-6" /> Post Issue or Suggestion
        </Button>
      </Link>
      <FeedbackWidget />
    </>
  );
}
