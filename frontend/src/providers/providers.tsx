"use client";

import { useUserStore } from "@/store/user-store";
import { ThemeProvider } from "next-themes";
import React from "react";

export function UserProvider() {
  const setUser = useUserStore((state) => state.setUser);
  const loadUser = useUserStore((state) => state.loadUser);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);
  return null;
}

export function Providers({ children }: React.PropsWithChildren) {
  const [mounted, setMounted] = React.useState(false);

  const contents = (
    <>
      <UserProvider />
      {children}
    </>
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return (
      <>
        <ThemeProvider defaultTheme="dark" themes={["dark", "light"]}>
          {contents}
        </ThemeProvider>
      </>
    );
  }
  return contents;
}
