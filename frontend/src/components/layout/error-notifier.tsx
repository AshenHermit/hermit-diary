"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/api-client/client-api";
import React from "react";

export function ErrorNotifier() {
  const { toast } = useToast();
  const onError = React.useCallback((message: string) => {
    toast({
      title: "Oh, error",
      description: message,
    });
  }, []);

  React.useEffect(() => {
    apiClient.errorCallback.add(onError);
  }, []);
  return <></>;
}
