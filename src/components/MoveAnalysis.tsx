"use client";

import React, { useEffect, useState } from "react";
import { useChessInsightStore } from "@/store/chessInsight";
import { analyzeMoveWithStockfish } from "@/lib/apiCalls";

export default function MoveAnalysis() {
  const { fen, currentAnalysis, setCurrentAnalysis, currentDepth, setCurrentDepth } = useChessInsightStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyze = async () => {
      if (!fen) return;

      setLoading(true);

      const result = await analyzeMoveWithStockfish(fen, currentDepth);

      setCurrentAnalysis(result);
      setLoading(false);
    };
    analyze();
  }, [fen]);

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Move Analysis</h2>
      {loading && <p>Analyzing move, please wait...</p>}
      {!loading && !currentAnalysis && <p>No analysis available for the current move.</p>}
      {!loading && currentAnalysis && (
        <div className="shadow p-3 rounded mb-3 border border-gray-200">
          <p><strong>FEN:</strong> {currentAnalysis.fen}</p>
          <p><strong>Evaluation:</strong> {currentAnalysis.eval}</p>
          <p><strong>Best Move:</strong> {currentAnalysis.move}</p>
          {/* <p><strong>Win Chance:</strong> {currentAnalysis.winChance.toFixed(2)}%</p> */}
          <p><strong>Description:</strong> {currentAnalysis.text}</p>
          {currentAnalysis.continuationArr?.length > 0 && (
            <p>
              <strong>Continuations:</strong> {currentAnalysis.continuationArr.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
