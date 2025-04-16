"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({redirectTo: "/"});
  };
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        className="w-full !bg-background !border-primary/20 hover:!bg-secondary/30 cursor-pointer"
        type="button"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}
