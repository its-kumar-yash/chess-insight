"use client";

import React, { useEffect, useState } from "react";
import { useChessInsightStore } from "@/store/chessInsight";
import {
  analyzeMoveWithStockfish,
  analyzeMoveWithStockfishV2,
} from "@/lib/apiCalls";
import { Chess } from "chess.js";
import { getMoveHistory, getToPosition } from "@/lib/chessUtils";
import {
  MoveClassifications,
  Report,
  StockfishAnalysisResponse,
} from "@/lib/types";
import { Progress } from "./ui/progress";
import { generateMoveReport, generateReport } from "@/lib/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import openings from "../resource/opening.json";


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

const MoveClassificationRow = ({
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
    switch (iconType) {
      case "brilliant":
        return (
          <Image
            src={"/brilliant_1024x.png"}
            width={20}
            height={20}
            alt="brilliant-move-icon"
          />
        );
      case "great":
        return (
          <Image
            src={"/great_find_1024x.png"}
            width={20}
            height={20}
            alt="great-move-icon"
          />
        );
      case "best":
        return (
          <Image
            src={"/best_1024x.png"}
            width={20}
            height={20}
            alt="best-move-icon"
          />
        );
      case "excellent":
        return (
          <Image
            src={"/excellent_1024x.png"}
            width={20}
            height={20}
            alt="excellent-move-icon"
          />
        );
      case "good":
        return (
          <Image
            src={"/good_1024x.png"}
            width={20}
            height={20}
            alt="good-move-icon"
          />
        );
      case "book":
        return (
          <Image
            src={"/book_1024x.png"}
            width={20}
            height={20}
            alt="book-move-icon"
          />
        );
      case "inaccuracy":
        return (
          <Image
            src={"/inaccuracy_1024x.png"}
            width={20}
            height={20}
            alt="inaccuracy-move-icon"
          />
        );
      case "mistake":
        return (
          <Image
            src={"/mistake_1024x.png"}
            width={20}
            height={20}
            alt="mistake-move-icon"
          />
        );
      case "blunder":
        return (
          <Image
            src={"/blunder_1024x.png"}
            width={20}
            height={20}
            alt="blunder-move-icon"
          />
        );
      case "forced":
        return (
          <Image
            src={"/forced_1024x.png"}
            width={20}
            height={20}
            alt="forced-move-icon"
          />
        );
      default:
        return null;
    }
  };

  const color =
    classificationColors[iconType as keyof typeof classificationColors] ||
    "white";

  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-500 font-medium w-24">{label}</div>
      <div className="font-bold text-lg" style={{ color: color }}>
        {whiteCount}
      </div>
      <div className="mx-2">{renderIcon()}</div>
      <div className="font-bold text-lg" style={{ color: color }}>
        {blackCount}
      </div>
    </div>
  );
};

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
    report,
    setReport,
    loading,
    setLoading,
  } = useChessInsightStore();

  const [progress, setProgress] = useState(0);
  const [openingInfo, setOpeningInfo] = useState<string>("Not Available");

  // call for all moves in the game
  useEffect(() => {
    const computeAllAnalysis = async () => {
      if (!chessGamePGN) return;
      setLoading(true);
      setProgress(0);
      const moveHistory = getMoveHistory(chessGamePGN as Chess);
      const totalMoves = moveHistory.length + 1;
      const analysisResults: (StockfishAnalysisResponse | null)[] = [];

      for (let i = 0; i < totalMoves; i++) {
        const currentFen = getToPosition(chessGamePGN as Chess, i);
        if (!currentFen) {
          continue;
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

        setProgress(Math.round(((i + 1) / totalMoves) * 100));
      }

      analysisArray.forEach((result, i) => {
        if (result) {
          // Find opening for this position
          const opening = openings.find(opening => result.fen?.includes(opening.fen));
          if (opening) {
            console.log("Opening found:", opening);
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

  useEffect(() => {
    if (analysisArray.length > 0) {
      setCurrentAnalysis(analysisArray[currentMoveIndex]);

      const report = generateReport(analysisArray);
      setReport(report);
    }
  }, [currentMoveIndex, analysisArray]);

  return (
    <div className="h-full">
      {loading ? (
        <div className="space-y-2">
          <p>Analyzing moves... {progress}% completed</p>
          <Progress className="w-full" value={progress} max={100} />
        </div>
      ) : chessGamePGN && report ? (
        // Render analysis elements only when report is available
        <div className="space-y-2">
          <Card className="!py-2 !flex-col !gap-0">
            <CardContent className="flex items-center justify-between px-3">
              <div>
                <span className="text-2xl font-semibold">Accuracies</span>
              </div>
              <div className="flex gap-4">
                <div className="border border-green-500 bg-white rounded-sm py-1 px-2 flex items-center">
                  <span className="text-xl font-semibold text-black">
                    {report.accuracies.white.toFixed(1)}%
                  </span>
                </div>
                <div className="border border-green-500 bg-black rounded-sm py-1 px-2 flex items-center">
                  <span className="text-xl font-semibold text-white">
                    {report.accuracies.black.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
            <Separator className="!mt-2" />
            <CardContent className="flex items-center justify-between pt-1 px-3">
              <div>
                <span className="text-md font-light">Starting Position</span>
              </div>
              <div>
                <span className="text-md font-light">{openingInfo}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="!py-2 !flex-col !gap-0">
            <CardContent className="px-3">
              <div className="">
                <MoveClassificationRow
                  label="Brilliant"
                  whiteCount={report.classifications.white.brilliant}
                  blackCount={report.classifications.black.brilliant}
                  iconType="brilliant"
                />
                <MoveClassificationRow
                  label="Great"
                  whiteCount={report.classifications.white.great}
                  blackCount={report.classifications.black.great}
                  iconType="great"
                />
                <MoveClassificationRow
                  label="Best"
                  whiteCount={report.classifications.white.best}
                  blackCount={report.classifications.black.best}
                  iconType="best"
                />
                <MoveClassificationRow
                  label="Excellent"
                  whiteCount={report.classifications.white.excellent}
                  blackCount={report.classifications.black.excellent}
                  iconType="excellent"
                />
                <MoveClassificationRow
                  label="Good"
                  whiteCount={report.classifications.white.good}
                  blackCount={report.classifications.black.good}
                  iconType="good"
                />
                <MoveClassificationRow
                  label="Book"
                  whiteCount={report.classifications.white.book}
                  blackCount={report.classifications.black.book}
                  iconType="book"
                />
                <MoveClassificationRow
                  label="Inaccuracy"
                  whiteCount={report.classifications.white.inaccuracy}
                  blackCount={report.classifications.black.inaccuracy}
                  iconType="inaccuracy"
                />
                <MoveClassificationRow
                  label="Mistake"
                  whiteCount={report.classifications.white.mistake}
                  blackCount={report.classifications.black.mistake}
                  iconType="mistake"
                />
                <MoveClassificationRow
                  label="Blunder"
                  whiteCount={report.classifications.white.blunder}
                  blackCount={report.classifications.black.blunder}
                  iconType="blunder"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Show message when no game is loaded or report is not ready
        <div className="flex flex-col items-center justify-center h-full">
          <Card className="p-6 text-center h-full">
            <CardTitle className="mb-4">No Chess Game Analysis</CardTitle>
            <CardContent>
              <p>Please input a chess game to see the analysis.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
