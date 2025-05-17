import { AUTH_COOKIE_NAME } from "@/constants";
import { logoutProfile } from "@/services/methods/user/auth";
import { useUserStore } from "@/store/user-store";
import { useCookies } from "next-client-cookies";
import React from "react";

export function useLogout() {
  const loadUser = useUserStore((state) => state.loadUser);
  const cookies = useCookies();
  const logout = React.useCallback(async () => {
    await logoutProfile();
    cookies.remove(AUTH_COOKIE_NAME);
    loadUser();
  }, [loadUser]);

  return logout;
}
