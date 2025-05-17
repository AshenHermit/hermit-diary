"use client";

import React from "react";

export function useRequestHandler() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const handleRequest = React.useCallback(
    async (requestFunc: () => Promise<void>) => {
      setLoading(true);
      setError(null);
      try {
        await requestFunc();
      } catch (e) {
        if (e instanceof Error) {
          e.message;
          setError(e.message);
        }
      }
      setLoading(false);
    },
    []
  );
  return { loading, error, handleRequest };
}
