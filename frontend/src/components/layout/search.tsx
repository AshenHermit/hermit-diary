"use client";

import {
  UserBadgeBase,
  UserBadgeLink,
} from "@/components/profile-shortcut/profile-shortcut";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { decodeId, encodeId } from "@/lib/hash-utils";
import { searchNotes, searchNotesInDiary } from "@/services/methods/user/notes";
import { NoteSearchResult, SearchNoteSchema } from "@/services/types/search";
import { useLoadingManager } from "@/store/loading-store";
import debounce from "just-debounce-it";
import {
  CircleDotDashedIcon,
  GlobeIcon,
  NotebookTextIcon,
  ScanSearch,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Diary } from "@/services/types/diary";
import classNames from "classnames";

export default function NotesSearch({
  open,
  setOpen,
  searchGlobalDefault,
  onSelected,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  searchGlobalDefault?: boolean;
  onSelected?: (note: SearchNoteSchema) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [results, setResults] = React.useState<NoteSearchResult | null>(null);
  const { startTask, endTask } = useLoadingManager();
  const router = useRouter();
  const params = useParams();
  const [searchGlobal, setSearchGlobal] = React.useState(searchGlobalDefault);
  const { loading, error, handleRequest } = useRequestHandler();

  const search = React.useCallback(
    (searchQuery: string) => {
      handleRequest(async () => {
        startTask("search");
        const searchQueryParams = {
          q: searchQuery,
          page: 1,
          perPage: 20,
          tags: [],
        };
        let res = null;
        if (params.diary_code && !searchGlobal) {
          res = await searchNotesInDiary(
            searchQueryParams,
            decodeId("diary", params.diary_code as string),
          );
        } else {
          res = await searchNotes(searchQueryParams);
        }
        console.log(res);
        setResults(res);
        endTask("search");
      });
    },
    [startTask, endTask, setResults, handleRequest, params, searchGlobal],
  );

  React.useEffect(() => {
    if (!params.diary_code && !searchGlobal) {
      setSearchGlobal(true);
      return;
    }
    search("");
  }, [searchGlobal, params, search]);

  React.useEffect(() => {
    if (params.diary_code && searchGlobal) {
      setSearchGlobal(false);
    }
  }, [open]);

  const debouncedSearch = React.useMemo(() => debounce(search, 500), [search]);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const goToNote = (doc: SearchNoteSchema) => {
    const diaryLink = `/diary/${encodeId("diary", parseInt(doc.diaryId))}?note=${encodeId("note", parseInt(doc.id))}&tab=note`;
    router.push(diaryLink);
  };

  const onSelect = (doc: SearchNoteSchema) => {
    if (onSelected) {
      onSelected(doc);
    } else {
      goToNote(doc);
    }
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-center gap-2 p-2">
          <Tabs
            value={searchGlobal ? "global" : "diary"}
            onValueChange={(value) => setSearchGlobal(value == "global")}
          >
            <TabsList>
              <TabsTrigger value="global" className="gap-2">
                <GlobeIcon /> Global
              </TabsTrigger>
              {params.diary_code ? (
                <TabsTrigger value="diary" className="gap-2">
                  <CircleDotDashedIcon /> Diary
                </TabsTrigger>
              ) : null}
            </TabsList>
          </Tabs>
        </div>
        <DialogTitle className="hidden">Search</DialogTitle>
        <CommandInput
          placeholder="Enter phrase to search notes..."
          onValueChange={handleValueChange}
          value={inputValue}
        />
        {
          <CommandList className="max-h-[70vh]">
            {open &&
              results &&
              results.hits.length > 0 &&
              results.hits.map((hit) => (
                <CommandItem
                  key={hit.document.id}
                  value={hit.document.title + hit.document.content}
                  className="flex cursor-pointer items-center gap-4"
                  onSelect={() => onSelect(hit.document)}
                >
                  <NotebookTextIcon />
                  <div className="flex w-full flex-col gap-1">
                    <div className="text-md flex items-center justify-between gap-4 font-semibold">
                      <div>{hit.document.title}</div>
                      {hit.document.diary ? (
                        <div className="flex flex-col items-end gap-2">
                          <UserBadgeBase
                            user={hit.document.diary.user}
                            className="bg-transparent !p-0"
                          />
                          <DiaryBadgeBase diary={hit.document.diary} />
                        </div>
                      ) : null}
                    </div>
                    {hit.highlights.length > 0 ? (
                      <div
                        className=""
                        dangerouslySetInnerHTML={{
                          __html: hit.highlights[0].snippet,
                        }}
                      ></div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </CommandItem>
              ))}
          </CommandList>
        }
      </CommandDialog>
    </>
  );
}

export function DiaryBadgeBase({
  diary,
  className,
}: {
  diary: Diary;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "relative flex w-fit cursor-pointer select-none items-center gap-3 rounded-2xl bg-transparent p-0 text-white/50",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        {diary.name} <CircleDotDashedIcon />
      </div>
    </div>
  );
}
