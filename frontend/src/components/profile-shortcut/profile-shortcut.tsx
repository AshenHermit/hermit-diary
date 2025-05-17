"use client";

import { profileLinks } from "@/app/(routing)/profile/sidebar-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/user-hooks";
import { apiClient } from "@services/api-client/client-api";
import { useLocalUserPicture, useUserStore } from "@store/user-store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export function ProfileShortcut() {
  const authorized = useUserStore((state) => state.authorized);
  const name = useUserStore((state) => state.name);
  const picture = useLocalUserPicture();
  const logout = useLogout();

  if (!authorized) {
    return (
      <div>
        <Button asChild>
          <Link href="/login/">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={picture}></AvatarImage>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {profileLinks.map((item) => (
              <DropdownMenuItem
                key={item.url}
                asChild
                className="cursor-pointer"
              >
                <Link href={item.url}>
                  <item.icon />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
