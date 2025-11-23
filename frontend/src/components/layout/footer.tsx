import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div className="glass">
      <div className="layout grid grid-cols-3 items-center justify-center gap-4 py-4 max-md:grid-cols-1">
        <Link
          href={"https://github.com/AshenHermit/hermit-diary"}
          target="_blank"
        >
          <div className="flex items-center justify-center gap-4">
            <Image alt="good" src="/lulz/good.gif" width={50} height={50} />
            <span className="rounded-xl bg-muted p-2 text-sm">
              AshenHermit/hermit-diary
            </span>
            GitHub
          </div>
        </Link>
        <Link
          href={"https://github.com/AshenHermit/hermit-diary/issues/new"}
          target="_blank"
        >
          <div className="flex items-center justify-center gap-4 text-center text-sm opacity-50">
            Report an issue or suggest an idea
          </div>
        </Link>
        <Link href={"/about"} target="_blank">
          <div className="flex items-center justify-center gap-4 text-sm opacity-50">
            About
          </div>
        </Link>
      </div>
    </div>
  );
}
