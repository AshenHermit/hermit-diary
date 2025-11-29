"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useRequestHandler } from "@/hooks/use-request-handler";
import React from "react";

export type ConfirmDialogApi = {
  open: () => void;
};
export function ConfirmDialog({
  apiRef,
  onConfirm,
  danger = false,
  title = "Deletion",
  description = "This action cannot be undone",
  cancelContent = "Cancel",
  okContent = "Delete",
}: {
  apiRef: React.MutableRefObject<ConfirmDialogApi | null>;
  onConfirm: () => Promise<void>;
  danger?: boolean;
  title?: string | React.ReactElement<any>;
  description?: string | React.ReactElement<any>;
  cancelContent?: string | React.ReactElement<any>;
  okContent?: string | React.ReactElement<any>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    apiRef.current = {
      open: () => setIsOpen(true),
    };
  }, [setIsOpen]);

  const onOk = React.useCallback(async () => {
    setIsLoading(true);
    await onConfirm();
    setIsOpen(false);
  }, [onConfirm]);

  React.useEffect(() => {}, [isOpen]);

  const onOpenChange = React.useCallback((state: boolean) => {
    setIsOpen(state);
    setTimeout(() => {
      if (!isOpen) {
        document.body.style.pointerEvents = "";
      }
    }, 100);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {isLoading ? (
          <div className="flex min-h-24 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="">{description}</div>
            <DialogFooter>
              <Button variant={"secondary"} onClick={() => setIsOpen(false)}>
                {cancelContent}
              </Button>
              <Button
                variant={danger ? "destructive" : "default"}
                onClick={onOk}
              >
                {okContent}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
