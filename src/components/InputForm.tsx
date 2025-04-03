"use client";

import React from "react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export default function InputForm() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center space-x-2">
        <Input type="username" placeholder="Enter Username" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>Choose Option</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Chess.com</DropdownMenuItem>
            <DropdownMenuItem>Lichess</DropdownMenuItem>
            <DropdownMenuItem>PGN</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button type="submit">Start Analysis</Button>
    </div>
  );
}
