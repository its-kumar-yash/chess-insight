"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { useChessInsightStore } from "@/store/chessInsight";
import { getMoveHistory, getToPosition } from "@/lib/chessUtils";
import { Chess } from "chess.js";
import { Slider } from "./ui/slider";

export default function NavigationPanel() {
  const { chessGamePGN, setFen, fen, currentDepth, setCurrentDepth } =
    useChessInsightStore();

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [position, setPosition] = useState("start");

  const moveHistory = getMoveHistory(chessGamePGN as Chess);

  useEffect(() => {
    setCurrentMoveIndex(0);
    setPosition("start");
    setFen("start");
  }, [chessGamePGN]);

  const goToMove = (index: number) => {
    if (!chessGamePGN) return;

    const currentFen = getToPosition(chessGamePGN as Chess, index);

    if (!currentFen) return;

    setCurrentMoveIndex(index);
    setPosition(currentFen);
    setFen(currentFen);
  };

  const handleNav = {
    first: () => goToMove(0),
    prev: () => goToMove(Math.max(0, currentMoveIndex - 1)),
    next: () => goToMove(Math.min(moveHistory.length, currentMoveIndex + 1)),
    last: () => goToMove(moveHistory.length),
    save: () => {
      if (!chessGamePGN) return;
      const blob = new Blob([chessGamePGN.pgn()], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "game.pgn";
      link.click();
      URL.revokeObjectURL(url);
    },
  };

  return (
    <div className="space-y-4">
      <div className="px-2">
        <label className="block text-sm font-medium mb-1">
          Analysis Depth: {currentDepth}
        </label>
        <Slider
          defaultValue={[currentDepth]}
          max={18}
          step={1}
          onValueChange={(value: number[]) => setCurrentDepth(value[0])}
        />
      </div>
      <div className="w-full flex justify-evenly gap-2">
        <Button variant="outline" className="w-16" onClick={handleNav.first}>
          <ChevronFirst className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-16" onClick={handleNav.prev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-16" onClick={handleNav.next}>
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-16" onClick={handleNav.last}>
          <ChevronLast className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-16" onClick={handleNav.save}>
          <Save className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
