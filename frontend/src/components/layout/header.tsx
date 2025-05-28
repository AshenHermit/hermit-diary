"use client";

import { ProfileShortcut } from "@/components/profile-shortcut/profile-shortcut";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useLoadingStore } from "@/store/loading-store";
import Link from "next/link";

export function Header() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <div className="glass">
      <div className="layout flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex items-center gap-4 text-xl font-extrabold">
            Hermit Diary {isLoading ? <LoadingSpinner /> : null}
          </div>
        </Link>
        <div className="flex items-center">
          <ProfileShortcut />
        </div>
      </div>
    </div>
  );
}
