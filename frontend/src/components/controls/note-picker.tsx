"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getDiaryNote, getDiaryNotes } from "@/services/methods/user/notes";
import { DiaryNote } from "@/services/types/notes";
import classNames from "classnames";
import {
  Check,
  ChevronsUpDown,
  CircleDotDashedIcon,
  GlobeIcon,
  NotebookIcon,
  NotebookTextIcon,
} from "lucide-react";
import React from "react";
import { Switch } from "../ui/switch";
import { SearchNoteSchema } from "@/services/types/search";
import NotesSearch from "../layout/search";

// TODO: потом можно сделать поиск по api когда будет готов typesense

export function NotePicker({
  diaryId,
  value,
  onValueChange,
  openIfNoValue,
}: {
  diaryId?: number;
  value: DiaryNote | null;
  onValueChange: (note: DiaryNote) => void;
  openIfNoValue?: boolean;
}) {
  const [open, setOpen] = React.useState(openIfNoValue);
  const [notes, setNotes] = React.useState<DiaryNote[]>([]);

  const loadNotes = React.useCallback(async () => {
    if (!diaryId) return;
    const fetchedNotes = await getDiaryNotes(diaryId);
    setNotes(fetchedNotes);
  }, []);

  const onSelected = React.useCallback(async (note: SearchNoteSchema) => {
    const fetchedNote = await getDiaryNote(parseInt(note.id));
    onValueChange(fetchedNote);
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      loadNotes();
    }
  }, [open]);

  return (
    <SearchButton
      onSelected={onSelected}
      variant="outline"
      className="flex items-center justify-between bg-secondary p-2"
    >
      <div className="flex items-center gap-2">
        <NotebookTextIcon />
        {value ? value.name : "Select note..."}
      </div>
      <ChevronsUpDown />
    </SearchButton>
  );
}

function SearchButton({
  onSelected,
  ...props
}: {
  onSelected: (note: SearchNoteSchema) => void;
} & ButtonProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <NotesSearch
        open={open}
        setOpen={setOpen}
        onSelected={onSelected}
      ></NotesSearch>
      <Button {...props} onClick={() => setOpen(true)} />
    </>
  );
}
