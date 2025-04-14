"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { useChessInsightStore } from "@/store/chessInsight";
import { Skeleton } from "./ui/skeleton";
import NewMoveList from "./NewMoveList";

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

export default function NewMovesPanel() {
  const {
    report,
    loading,
    currentAnalysis,
    currentMoveIndex,
    chessGamePGN,
    openingInfo,
  } = useChessInsightStore();

  // Current move information
  const moves = chessGamePGN?.history({ verbose: true }) ?? [];
  const moveInfo = moves[currentMoveIndex - 1]; // -1 because it's the move just played

  const classification =
    report?.moves[currentMoveIndex - 1]?.classification ?? "";
  const color =
    classificationColors[classification as keyof typeof classificationColors] ??
    "#000000";

  if (loading) {
    // If loading is true, show the skeleton loader
    return (
      <Card className="w-full md:w-1/3 px-4 !gap-3 !bg-card/20 !border-primary/20">
        <Skeleton className="h-12 w-full mb-4 !bg-primary/30" />{" "}
        <Skeleton className="h-12 w-full mb-4 !bg-primary/30" />{" "}
        <Skeleton className="h-20 w-full !bg-primary/30" />{" "}
      </Card>
    );
  }

  // Current move display
  let currentMoveElement;
  if (currentMoveIndex === 0) {
    currentMoveElement = <p className="text-lg font-light">Game started</p>;
  } else if (currentMoveIndex > 0 && moveInfo) {
    currentMoveElement = (
      <p className="text-lg font-light">
        Move <span className="font-medium">{moveInfo.san}</span> was{" "}
        <span className="text-lg font-bold capitalize" style={{ color }}>
          {classification}
        </span>
      </p>
    );
  }

  return (
    <Card className="max-w-[30%] w-full px-4 !py-3 !gap-3 !bg-card/20 !border-primary/20">
      {/* Opening Information */}
      <Card className="mb-2 shadow-sm !p-0 bg-muted !border-primary/20">
        <CardContent className="py-3 px-4">
          <h3 className="text-sm font-md mb-1">Opening</h3>
          <p className="font-bold text-base">
            {openingInfo || "No opening detected"}
          </p>
        </CardContent>
      </Card>

      {/* Best Move Information */}
      <Card className="mb-2 shadow-sm !p-0 bg-muted !border-primary/20">
        <CardContent className="flex justify-between items-center py-3 px-4">
          <span className="text-lg font-md">Best Move:</span>
          <span className="text-lg font-bold">
            {currentAnalysis?.san || "—"}
          </span>
        </CardContent>
      </Card>

      {/* Current Move Information */}
      <Card className="mb-2 shadow-sm !p-0 bg-muted !border-primary/20">
        <CardContent className="flex items-center justify-center py-3 px-4">
          {currentMoveElement}
        </CardContent>
      </Card>

      <NewMoveList />
    </Card>
  );
}
