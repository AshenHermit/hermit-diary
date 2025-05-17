import { ProfileRedirectComponent } from "@/app/(routing)/profile/redirect";
import { SidebarProfileLayout } from "@/app/(routing)/profile/sidebar-layout";
import { Suspense } from "react";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="mx-auto h-full max-w-[1300px] py-4">
      <ProfileRedirectComponent />
      <Suspense>
        <SidebarProfileLayout>{children}</SidebarProfileLayout>
      </Suspense>
    </div>
  );
}
