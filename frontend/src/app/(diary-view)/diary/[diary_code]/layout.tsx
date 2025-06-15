import { DiaryLayout } from "@/app/(diary-view)/diary/[diary_code]/control-panel/diary-layout";
import { DiaryStoreProvider } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { Header } from "@/components/layout/header";

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="grid h-[100svh] max-h-[100svh] grid-rows-[auto_1fr]">
      <Header />
      <div className="grid h-full w-full grid-rows-1">
        <DiaryStoreProvider>
          <DiaryLayout>{children}</DiaryLayout>
        </DiaryStoreProvider>
      </div>
    </div>
  );
}
