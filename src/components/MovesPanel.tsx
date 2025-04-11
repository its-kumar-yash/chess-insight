"use client";

import React from "react";
import { Card } from "./ui/card";
import BestMove from "./BestMove";
import CurrentMoveCard from "./CurrentMoveCard";
import MoveList from "./MoveList";
import { useChessInsightStore } from "@/store/chessInsight";
import { Skeleton } from "./ui/skeleton"; // Import the Skeleton component

export default function MovesPanel() {
  const { report, loading } = useChessInsightStore();

  if (loading) {
    // If loading is true, show the skeleton loader
    return (
      <Card className="w-full md:w-1/3 px-4 !gap-3">
        <Skeleton className="h-12 w-full mb-4" />{" "}
        <Skeleton className="h-12 w-full mb-4" />{" "}
        <Skeleton className="h-20 w-full" />{" "}

      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="w-full md:w-1/3 px-4 !gap-3">
        <p className="text-center">
          No report available. Please load a game to view the moves.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full md:w-1/3 px-4 !gap-3">
      <BestMove />
      <CurrentMoveCard />
      <MoveList />
    </Card>
  );
}
