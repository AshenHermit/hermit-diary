"use client";

import { useUserStore } from "@store/user-store";
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
  return (
    <>
      <ThemeProvider defaultTheme="dark" themes={["dark", "light"]}>
        <UserProvider />
        {children}
      </ThemeProvider>
    </>
  );
}
