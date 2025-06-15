"use client";

import NotesSearch from "@/components/layout/search";
import { ProfileShortcut } from "@/components/profile-shortcut/profile-shortcut";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useLoadingStore } from "@/store/loading-store";
import { ScanSearch } from "lucide-react";
import Link from "next/link";
import React from "react";

export function Header() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="glass">
      <div className="layout flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-4 text-xl font-extrabold">
              Hermit Diary {isLoading ? <LoadingSpinner /> : null}
            </div>
          </Link>
          <NotesSearch open={searchOpen} setOpen={setSearchOpen} />
          <Button
            onClick={() => setSearchOpen(true)}
            variant={"ghost"}
            className="px-3 py-0"
          >
            <ScanSearch className="!size-6" />
          </Button>
        </div>
        <div className="flex items-center">
          <ProfileShortcut />
        </div>
      </div>
    </div>
  );
}
