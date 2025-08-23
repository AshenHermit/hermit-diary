import { MainPageClientContent } from "@/app/(routing)/(homepage)/client-content";
import { metadata } from "./homepage-metadata";

export { metadata };

export default function Page() {
  return (
    <div className="layout flex min-h-full items-center justify-center py-4">
      <div className="flex max-w-full flex-col gap-4">
        <MainPageClientContent />
      </div>
    </div>
  );
}
