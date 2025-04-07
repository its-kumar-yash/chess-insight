"use client";

import React, { useEffect, useState } from "react";
import { useChessInsightStore } from "@/store/chessInsight";
import {
  analyzeMoveWithStockfish,
  analyzeMoveWithStockfishV2,
} from "@/lib/apiCalls";
import { Chess } from "chess.js";
import { getMoveHistory, getToPosition } from "@/lib/chessUtils";
import { StockfishAnalysisResponse } from "@/lib/types";
import { Progress } from "./ui/progress";

export default function MoveAnalysis() {
  const {
    chessGamePGN,
    fen,
    currentAnalysis,
    setCurrentAnalysis,
    analysisArray,
    setAnalysisArray,
    currentDepth,
    setCurrentDepth,
    currentMoveIndex,
  } = useChessInsightStore();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // call for all moves in the game
  useEffect(() => {
    const computeAllAnalysis = async () => {
      if (!chessGamePGN) return;
      setLoading(true);
      setProgress(0);
      const moveHistory = getMoveHistory(chessGamePGN as Chess);
      const totalMoves = moveHistory.length + 1;
      const analysisResults: (StockfishAnalysisResponse | null)[] = [];

      analysisResults.push(null);
      
      for (let i = 1; i < totalMoves; i++) {
        const currentFen = getToPosition(chessGamePGN as Chess, i);
        if (!currentFen) {
          continue;
          analysisResults.push(null);
          continue
        }

        try {
          const result = await analyzeMoveWithStockfish(
            currentFen,
            currentDepth
          );
          analysisResults.push(result);
        } catch (error) {
          analysisResults.push(null);
          console.error(`Error analyzing move ${i}:`, error);
        }

        setProgress(Math.round((i / (totalMoves - 1)) * 100));
      }

      setAnalysisArray(analysisResults.filter((result): result is StockfishAnalysisResponse => result !== null));

      setCurrentAnalysis(analysisResults[currentMoveIndex]);
      setLoading(false);
    };

    computeAllAnalysis();
  }, [chessGamePGN, currentDepth]);

  useEffect(() => {
    if (analysisArray.length > 0) {
      setCurrentAnalysis(analysisArray[currentMoveIndex]);
    }
  }, [currentMoveIndex, analysisArray]);

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Move Analysis</h2>
      {loading ? (
        <div className="space-y-2">
          <p>Analyzing moves... {progress}% completed</p>
          {/* <progress className="w-full" value={progress} max="100" /> */}
          <Progress className="w-full" value={progress} max={100} />

        </div>
      ) : (
        <>
          {!currentAnalysis && (
            <p>No analysis available for the current move.</p>
          )}
          {currentAnalysis && (
            <div className="shadow p-3 rounded mb-3 border border-gray-200">
              <p>
                <strong>Evaluation:</strong> {currentAnalysis.eval}
              </p>
              <p>
                <strong>Best Move:</strong> {currentAnalysis.move}
              </p>
              <p>
                <strong>Mate:</strong> {currentAnalysis.mate}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
