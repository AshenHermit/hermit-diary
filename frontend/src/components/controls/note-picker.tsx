"use client";

import { Button } from "@/components/ui/button";
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
import { getDiaryNotes } from "@/services/methods/user/notes";
import { DiaryNote } from "@/services/types/notes";
import classNames from "classnames";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

// TODO: потом можно сделать поиск по api когда будет готов typesense

export function NotePicker({
  diaryId,
  value,
  onValueChange,
  openIfNoValue,
}: {
  diaryId: number;
  value: DiaryNote | null;
  onValueChange: (note: DiaryNote) => void;
  openIfNoValue?: boolean;
}) {
  const [open, setOpen] = React.useState(openIfNoValue);
  const [notes, setNotes] = React.useState<DiaryNote[]>([]);

  const loadNotes = React.useCallback(async () => {
    const fetchedNotes = await getDiaryNotes(diaryId);
    setNotes(fetchedNotes);
  }, []);

  React.useEffect(() => {
    if (open) {
      loadNotes();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value.name : "Select note..."}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search note..." className="h-9" />
          <CommandEmpty>No note found.</CommandEmpty>
          <CommandGroup>
            {notes.map((note) => (
              <CommandItem
                key={note.id}
                value={note.id.toString()}
                onSelect={(value) =>
                  onValueChange(
                    notes.filter((x) => x.id.toString() == value)[0],
                  )
                }
              >
                {note.name}
                <Check
                  className={classNames(
                    "ml-auto",
                    value?.id == note.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
