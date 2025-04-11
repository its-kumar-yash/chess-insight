"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { useChessInsightStore } from "@/store/chessInsight";

const classificationColors = {
  brilliant: "#1cada6",
  great: "#5b8baf",
  best: "#96bc4b",
  excellent: "#96bc4b",
  good: "#95af8a",
  inaccuracy: "#f7bf44",
  mistake: "#e48f2a",
  blunder: "#ca3531",
  book: "#a98966",
  forced: "#d0d0d0",
};

export default function CurrentMoveCard() {
  const { currentAnalysis, report, currentMoveIndex, chessGamePGN } =
    useChessInsightStore();

  const moves = chessGamePGN?.history({ verbose: true }) ?? [];
  const moveInfo = moves[currentMoveIndex - 1]; // -1 because it's the move just played

  const classification =
    report?.moves[currentMoveIndex - 1]?.classification ?? "";
  const color =
    classificationColors[classification as keyof typeof classificationColors] ??
    "#000000";

  let resultElement;
  if (currentMoveIndex === 0) {
    resultElement = <p className="text-lg font-light">Game started</p>;
  } else if (currentMoveIndex > 0 && moveInfo) {
    resultElement = (
      <p className="text-lg font-light">
        Move <span className="font-medium">{moveInfo.san}</span> was{" "}
        <span className="text-lg font-bold capitalize" style={{ color }}>
          {classification}
        </span>
      </p>
    );
  }

  return (
    <Card className="!py-2 !flex-col !gap-0">
      <CardContent className="flex items-center justify-center px-3">
        {resultElement}
      </CardContent>
    </Card>
  );
}
