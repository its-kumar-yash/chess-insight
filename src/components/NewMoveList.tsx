"use client";

import { useChessInsightStore } from "@/store/chessInsight";
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function NewMoveList() {
  const { report, currentMoveIndex, chessGamePGN } = useChessInsightStore();

  const movesFromGame = chessGamePGN?.history({ verbose: true }) ?? [];
  const reportMoves = report?.moves || [];

  const movesPairs = [];

  for (let i = 0; i < reportMoves.length; i += 2) {
    movesPairs.push({
      white: {
        san: movesFromGame[i]?.san ?? "—",
        classification: reportMoves[i]?.classification ?? "",
      },
      black: reportMoves[i + 1]
        ? {
            san: movesFromGame[i + 1]?.san ?? "—",
            classification: reportMoves[i + 1]?.classification ?? "",
          }
        : undefined,
    });
  }

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const highlightedIndex = currentMoveIndex - 1;

    const el = refs.current[highlightedIndex];

    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentMoveIndex]);

  const getIcon = (classification: string) => {
    if (classification === "best") return "/best_1024x.png";
    if (classification === "blunder") return "/blunder_1024x.png";
    if (classification === "mistake") return "/mistake_1024x.png";
    if (classification === "inaccuracy") return "/inaccuracy_1024x.png";
    if (classification === "forced") return "/forced_1024x.png";
    if (classification === "brilliant") return "/brilliant_1024x.png";
    if (classification === "great") return "/great_1024x.png";
    if (classification === "excellent") return "/excellent_1024x.png";
    if (classification === "good") return "/good_1024x.png";
    if (classification === "book") return "/book_1024x.png";
    else return "";
  };

  const getIndex = (pairIndex: number, isWhite: boolean) =>
    isWhite ? pairIndex * 2 : pairIndex * 2 + 1;

  const isCurrent = (index: number) => currentMoveIndex - 1 === index;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full p-6 text-center">
          <CardContent>
            <p className="text-muted-foreground">
              No report available. Please load a game to view the moves.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="!bg-card/20 !border-primary/20 w-full p-1">
      <CardContent className="px-2 max-h-[400px] overflow-y-auto">
        <div className="space-y-2">
          {movesPairs.map((movePair, pairIndex) => (
            <div key={pairIndex} className="grid grid-cols-2 gap-2">
              <div
                ref={(el) => {
                  refs.current[getIndex(pairIndex, true)] = el;
                }}
                className={`flex items-center gap-2 p-2 rounded hover:bg-muted ${
                  isCurrent(getIndex(pairIndex, true)) ? "bg-primary/20" : ""
                }`}
              >
                <span className="text-sm text-muted-foreground">
                  {pairIndex + 1}.
                </span>
                <span className="font-medium">{movePair.white.san}</span>
                {movePair.white.classification && (
                  <Image
                    src={getIcon(movePair.white.classification)}
                    alt={movePair.white.classification}
                    width={16}
                    height={16}
                  />
                )}
              </div>
              {movePair.black && (
                <div
                  ref={(el) => {
                    refs.current[getIndex(pairIndex, false)] = el;
                  }}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-muted ${
                    isCurrent(getIndex(pairIndex, false)) ? "bg-primary/20" : ""
                  }`}
                >
                  <span className="font-medium">{movePair.black.san}</span>
                  {movePair.black.classification && (
                    <Image
                      src={getIcon(movePair.black.classification)}
                      alt={movePair.black.classification}
                      width={16}
                      height={16}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
