"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";

function getRandomGradient() {
  const colors = [
    ["#ff9a9e", "#fad0c4"],
    ["#a18cd1", "#fbc2eb"],
    ["#fbc2eb", "#a6c1ee"],
    ["#ffecd2", "#fcb69f"],
    ["#f6d365", "#fda085"],
    ["#84fab0", "#8fd3f4"],
    ["#cfd9df", "#e2ebf0"],
  ];
  const [start, end] = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${start}, ${end})`;
}

export default function UserProfileModal({ user }: { user: any }) {
  const gradient = useMemo(() => getRandomGradient(), [user?.image]);

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 overflow-hidden"
        >
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.name ?? "User"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div
                suppressHydrationWarning
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium "
              style={{ background: gradient }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 !bg-background !border-primary/20" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || ""}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="!bg-primary/20" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:!bg-secondary">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:!bg-secondary">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="!bg-primary/20" />
        <DropdownMenuItem className="cursor-pointer hover:!bg-secondary" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
