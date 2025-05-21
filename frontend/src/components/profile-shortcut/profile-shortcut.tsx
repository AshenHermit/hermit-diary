"use client";

import { profileLinks } from "@/app/(routing)/profile/sidebar-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/user-hooks";
import { GlobalUser } from "@/services/types/user";
import { useLocalUserPicture, useUserStore } from "@/store/user-store";
import { PersonStandingIcon } from "lucide-react";
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

export function UserBadge({ user }: { user: GlobalUser }) {
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-fit cursor-pointer select-none items-center gap-4 rounded-2xl bg-muted/50 p-2 pr-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.picture}></AvatarImage>
            </Avatar>
            <div className="text-sm font-semibold">{user.name}</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/`}>
                <PersonStandingIcon />
                Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
