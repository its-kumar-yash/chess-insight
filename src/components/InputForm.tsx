"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { parsePGN } from "@/lib/chessUtils";
import { Textarea } from "./ui/textarea";
import { Chess } from "chess.js";
import { useChessInsightStore } from "@/store/chessInsight";

export default function InputForm() {
  const {
    inputPGN,
    setInputPGN,
    chessGamePGN,
    setChessGamePGN,
    inputUsername,
    setInputUsername,
    gameListByUsername,
    setGameListByUsername,
  } = useChessInsightStore();

  const [selectOption, setSelectOption] = useState("PGN");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const handleOptionSelect = (option: string) => {
    setSelectOption(option);
    setInputUsername("");
    setInputPGN("");
    // setShowGames(false);
    setSelectedGame(null);
    setIsOpen(false);
  };

  const handleUsernameSubmit = () => {
    if (!inputUsername.trim()) return;

    console.log(`Fetching games for ${inputUsername} from ${selectOption}`);
    // setShowGames(true);
  };

  const handleStartAnalysis = () => {
    if (selectOption === "PGN") {
      if (inputPGN.length === 0) return;
      const chessGame = parsePGN(inputPGN);
      setChessGamePGN(chessGame);
      if (!chessGame) {
        console.log("Invalid PGN format.");
      }
    } else {
    }
  };

  console.log(chessGamePGN?.history());

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center space-x-2">
        {selectOption !== "PGN" ? (
          <Input
            type="text"
            value={inputUsername}
            onChange={handleUsernameChange}
            placeholder={`${
              selectOption === "PGN"
                ? "Enter PGN notation"
                : `Enter ${selectOption} username`
            }`}
            className="flex-grow"
          />
        ) : (
          <Textarea
            placeholder="Enter PGN notation"
            className="min-h-7 max-h-9 overflow-y-scroll resize-none focus-visible:ring-0 p-2 text-base !bg-transparent"
            value={inputPGN}
            onChange={(e) => setInputPGN(e.target.value)}
          />
        )}
        {selectOption !== "PGN" && (
          <Button onClick={handleUsernameSubmit}>Submit</Button>
        )}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectOption === "PGN" ? "PGN" : ""}
              <ChevronDown
                className={`h-4 w-4 ${isOpen ? "rotate-180" : ""}`}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOptionSelect("Chess.com")}>
              Chess.com
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("Lichess")}>
              Lichess
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("PGN")}>
              PGN
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        type="submit"
        onClick={handleStartAnalysis}
        disabled={
          (selectOption !== "PGN" && !selectedGame) ||
          (selectOption === "PGN" && !inputPGN.trim())
        }
        className="w-full"
      >
        Start Analysis
      </Button>
    </div>
  );
}
