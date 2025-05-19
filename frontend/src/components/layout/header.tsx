import { ProfileShortcut } from "@/components/profile-shortcut/profile-shortcut";
import Link from "next/link";

export function Header() {
  return (
    <div className="glass">
      <div className="layout flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex items-center gap-4 text-xl font-extrabold">
            Hermit Diary
          </div>
        </Link>
        <div className="flex items-center">
          <ProfileShortcut />
        </div>
      </div>
    </div>
  );
}
