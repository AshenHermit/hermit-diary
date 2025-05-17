"use client";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import React from "react";

export function ProfileRedirectComponent() {
  const loaded = useUserStore((state) => state.loaded);
  const authorized = useUserStore((state) => state.authorized);
  const router = useRouter();

  React.useEffect(() => {
    if (loaded && !authorized) {
      router.replace("/");
    }
  }, [loaded, authorized, router]);

  return <></>;
}
