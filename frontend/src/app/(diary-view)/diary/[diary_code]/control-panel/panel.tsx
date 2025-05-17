"use client";

import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/spinner";
import classNames from "classnames";
import React from "react";

export function DiaryTabPanel({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const diaryLoaded = useDiaryStore((state) => state.loaded);
  if (!diaryLoaded)
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  return (
    <div
      className={classNames("flex flex-col gap-4 p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
