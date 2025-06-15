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
import { NotebookTextIcon, ScanSearch } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function NotesSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [results, setResults] = React.useState<NoteSearchResult | null>(null);
  const { startTask, endTask } = useLoadingManager();
  const router = useRouter();
  const params = useParams();

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
        if (params.diary_code) {
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
    [startTask, endTask, setResults, handleRequest, params],
  );

  const debouncedSearch = React.useMemo(() => debounce(search, 500), [search]);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const goToNote = (doc: SearchNoteSchema) => {
    const diaryLink = `/diary/${encodeId("diary", parseInt(doc.diaryId))}?note=${encodeId("note", parseInt(doc.id))}&tab=note`;
    router.push(diaryLink);
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">SS</DialogTitle>
        <CommandInput
          placeholder="Введите фразу для поиска записей..."
          onValueChange={handleValueChange}
          value={inputValue}
        />
        {
          <CommandList>
            {open &&
              results &&
              results.hits.length > 0 &&
              results.hits.map((hit) => (
                <CommandItem
                  key={hit.document.id}
                  value={hit.document.title + hit.document.content}
                  className="flex cursor-pointer items-center gap-4"
                  onSelect={() => goToNote(hit.document)}
                >
                  <NotebookTextIcon />
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between gap-4 text-lg font-semibold">
                      <div>{hit.document.title}</div>
                      {hit.document.diary ? (
                        <UserBadgeBase
                          user={hit.document.diary.user}
                          className="bg-transparent !p-0"
                        />
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
