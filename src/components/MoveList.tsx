"use client";

import React, { useEffect, useRef } from "react";
import { useChessInsightStore } from "@/store/chessInsight";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function MoveList() {
  const { report, currentMoveIndex, chessGamePGN } = useChessInsightStore();

  const movesFromGame = chessGamePGN?.history({ verbose: true }) ?? [];
  const reportMoves = report?.moves || [];

  const movePairs = [];
  for (let i = 0; i < reportMoves.length; i += 2) {
    movePairs.push({
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
    if (classification === "great") return "/great_find_1024x.png";
    if (classification === "excellent") return "/excellent_1024x.png";
    if (classification === "good") return "/good_1024x.png";
    if (classification === "book") return "/book_1024x.png";
    else return "";
  };

  const getIndex = (pairIndex: number, isWhite: boolean) =>
    isWhite ? pairIndex * 2 : pairIndex * 2 + 1;

  const isCurrent = (index: number) => currentMoveIndex - 1 === index;

  return (
    <Card className="h-[450px] overflow-y-auto !py-3">
      <CardContent>
        {movePairs.map((pair, i) => (
          <div key={i} className="flex text-base py-1 items-center gap-4 w-max">
            <div className="text-gray-400 w-6 text-sm">{i + 1}.</div>

            {/* White move */}
            <div
              ref={(el) => {
                refs.current[getIndex(i, true)] = el;
              }}
              className={`px-3 py-1 rounded-sm flex items-center gap-1 transition-all ${
                isCurrent(getIndex(i, true))
                  ? "bg-blue-400 font-semibold shadow-sm"
                  : "hover:bg-gray-500"
              }`}
            >
              <span>{pair.white.san}</span>
              {pair.white.classification && (
                <Image
                  src={getIcon(pair.white.classification)}
                  alt={pair.white.classification}
                  width={16}
                  height={16}
                  className=""
                />
              )}
            </div>

            {/* Black move */}
            {pair.black && (
              <div
                ref={(el) => {
                  refs.current[getIndex(i, false)] = el;
                }}
                className={`px-3 py-1 rounded-sm flex justify-center items-center gap-1 transition-all ${
                  isCurrent(getIndex(i, false))
                    ? "bg-blue-400 font-semibold shadow-sm"
                    : "hover:bg-gray-500"
                }`}
              >
                <span>{pair.black.san}</span>
                {pair.black.classification && (
                  <Image
                    src={getIcon(pair.black.classification)}
                    alt={pair.black.classification}
                    width={16}
                    height={16}
                    className=""
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
