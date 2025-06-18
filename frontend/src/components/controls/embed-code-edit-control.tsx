"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import classNames from "classnames";
import React from "react";

export function EmbedBlockEditControl({
  children,
  initValue,
  onValueChange,
  onApply,
}: {
  initValue?: string;
  onValueChange?: (value: string) => void;
  onApply?: (value: string) => void;
  children: () => React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState(initValue ?? "");

  React.useEffect(() => {
    setInputText(initValue ?? "");
  }, [initValue]);

  const recieveNewValue = React.useCallback(
    (value: string) => {
      setInputText(value);
      if (onValueChange) onValueChange(value);
    },
    [onValueChange],
  );

  const applyEmbeddingCode = React.useCallback(() => {
    if (onApply) onApply(inputText);
    setOpen(false);
  }, [inputText, onApply]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children()}</DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-96 flex-col gap-1">
        <Textarea
          ref={(textarea) => {
            if (textarea) {
              textarea.style.height = "0px";
              textarea.style.height = textarea.scrollHeight + "px";
            }
          }}
          value={inputText}
          onChangeCapture={(e) => recieveNewValue(e.currentTarget.value)}
        ></Textarea>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={applyEmbeddingCode}
        >
          OK
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
