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
  title = "удаление",
  description = "безвозвратно",
  cancelContent = "Отмена",
  okContent = "Удалить",
}: {
  apiRef: React.MutableRefObject<ConfirmDialogApi | null>;
  onConfirm: () => Promise<void>;
  danger?: boolean;
  title?: string | React.ReactElement;
  description?: string | React.ReactElement;
  cancelContent?: string | React.ReactElement;
  okContent?: string | React.ReactElement;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
