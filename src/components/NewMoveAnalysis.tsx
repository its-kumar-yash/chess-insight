"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { useChessInsightStore } from "@/store/chessInsight";
import { getMoveHistory, getToPosition } from "@/lib/chessUtils";
import { StockfishAnalysisResponse } from "@/lib/types";
import { analyzeMoveWithStockfish } from "@/lib/apiCalls";
import openings from "../resource/opening.json";
import { generateReport } from "@/lib/analysis";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

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

const MoveClassificationItem = ({
  label,
  whiteCount,
  blackCount,
  iconType,
}: {
  label: string;
  whiteCount: number;
  blackCount: number;
  iconType: string;
}) => {
  const renderIcon = () => {
    return (
      <Image
        src={`/${iconType}_1024x.png`}
        width={24}
        height={24}
        alt={`${iconType}-move-icon`}
      />
    );
  };

  const color =
    classificationColors[iconType as keyof typeof classificationColors] ||
    "white";

  return (
    <div className="flex items-center justify-between py-1 hover:bg-secondary/50 hover:rounded-md">
      <div className="flex items-center gap-2 pl-2">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center">
        <span className="font-bold w-8 text-center" style={{ color }}>
          {whiteCount}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mx-4"
        >
          <span className="">{renderIcon()}</span>
        </div>
        <span className="font-bold w-8 text-center" style={{ color }}>
          {blackCount}
        </span>
      </div>
    </div>
  );
};

export default function NewMoveAnalysis() {
  const {
    chessGamePGN,
    currentAnalysis,
    setCurrentAnalysis,
    analysisArray,
    setAnalysisArray,
    currentDepth,
    currentMoveIndex,
    report,
    setReport,
    loading,
    setLoading,
    openingInfo,
    setOpeningInfo,
  } = useChessInsightStore();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const computeAllAnalysis = async () => {
      if (!chessGamePGN) return;

      setLoading(true);
      setProgress(0);

      const moveHistory = getMoveHistory(chessGamePGN);
      const totalMoves = moveHistory.length + 1;
      const analysisResults: (StockfishAnalysisResponse | null)[] = [];

      for (let i = 0; i < totalMoves; i++) {
        const currentFen = getToPosition(chessGamePGN, i);

        if (!currentFen) continue;

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

        setProgress(Math.round(((i + 1) / totalMoves) * 100));
      }

      // Check for openings
      analysisResults.forEach((result) => {
        if (result) {
          const opening = openings.find((opening) =>
            result.fen?.includes(opening.fen)
          );
          if (opening) {
            // console.log("Opening found:", opening);
            result.opening = opening.name;
            setOpeningInfo(opening.name);
          }
        }
      });

      setAnalysisArray(
        analysisResults.filter(
          (result): result is StockfishAnalysisResponse => result !== null
        )
      );

      setCurrentAnalysis(analysisResults[currentMoveIndex]);
      setLoading(false);
    };

    computeAllAnalysis();
  }, [chessGamePGN, currentDepth]);

  //update anlysis when move index changes
  useEffect(() => {
    if (analysisArray.length > 0) {
      setCurrentAnalysis(analysisArray[currentMoveIndex]);
      const generatedReport = generateReport(analysisArray);
      setReport(generatedReport);
    }
  }, [currentMoveIndex, analysisArray]);

  // Render loading state or content
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full p-6">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-bold">Analyzing Chess Game</h3>
            <p>Analyzing moves... {progress}% completed</p>
            <Progress className="w-full" value={progress} max={100} />
          </CardContent>
        </Card>
      </div>
    );
  }

  //render empty state
  if (!chessGamePGN || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full p-6 text-center">
          <CardContent>
            <p className="text-muted-foreground">
              Please input a chess game to see the analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold mb-2">Accuracy</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted p-3 rounded-lg text-center border-1 border-primary/20 shadow-sm">
            <p className="text-sm font-medium mb-1">White</p>
            <p className="text-2xl font-bold">
              {report.accuracies.white.toFixed(1)}%
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center border-1 border-primary/20 shadow-sm">
            <p className="text-sm font-medium mb-1">Black</p>
            <p className="text-2xl font-bold">
              {report.accuracies.black.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      <Separator className="!bg-secondary" />

      <div>
        <div className="space-y-1">
          <MoveClassificationItem
            label="Brilliant"
            whiteCount={report.classifications.white.brilliant}
            blackCount={report.classifications.black.brilliant}
            iconType="brilliant"
          />
          <MoveClassificationItem
            label="Great"
            whiteCount={report.classifications.white.great}
            blackCount={report.classifications.black.great}
            iconType="great"
          />
          <MoveClassificationItem
            label="Best"
            whiteCount={report.classifications.white.best}
            blackCount={report.classifications.black.best}
            iconType="best"
          />
          <MoveClassificationItem
            label="Excellent"
            whiteCount={report.classifications.white.excellent}
            blackCount={report.classifications.black.excellent}
            iconType="excellent"
          />
          <MoveClassificationItem
            label="Good"
            whiteCount={report.classifications.white.good}
            blackCount={report.classifications.black.good}
            iconType="good"
          />
          <MoveClassificationItem
            label="Book"
            whiteCount={report.classifications.white.book}
            blackCount={report.classifications.black.book}
            iconType="book"
          />

          <MoveClassificationItem
            label="Inaccuracy"
            whiteCount={report.classifications.white.inaccuracy}
            blackCount={report.classifications.black.inaccuracy}
            iconType="inaccuracy"
          />
          <MoveClassificationItem
            label="Mistake"
            whiteCount={report.classifications.white.mistake}
            blackCount={report.classifications.black.mistake}
            iconType="mistake"
          />
          <MoveClassificationItem
            label="Blunder"
            whiteCount={report.classifications.white.blunder}
            blackCount={report.classifications.black.blunder}
            iconType="blunder"
          />
        </div>
      </div>
    </div>
  );
}
