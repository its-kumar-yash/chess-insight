"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { useChessInsightStore } from "@/store/chessInsight";

export default function BestMove() {
  const { currentAnalysis, report, currentMoveIndex } = useChessInsightStore();

  return (
    <Card className="!py-2 !flex-col !gap-0">
      <CardContent className="flex justify-between items-center px-3">
        <span className="text-lg font-light">Best Move:</span>
        <span className="text-lg font-bold">{currentAnalysis?.san}</span>
      </CardContent>
    </Card>
  );
}
