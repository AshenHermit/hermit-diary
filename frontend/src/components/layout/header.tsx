import { ProfileShortcut } from "@components/profile-shortcut/profile-shortcut";
import Link from "next/link";

export function Header() {
  return (
    <div className="glass">
      <div className="layout py-4 flex justify-between items-center">
        <Link href="/">
          <div className="font-extrabold text-xl flex items-center gap-4">
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
