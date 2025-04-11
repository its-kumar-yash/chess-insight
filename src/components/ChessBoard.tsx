"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import PlayerCard from "./PlayerCard";
import { useChessInsightStore } from "@/store/chessInsight";
import EvaluationBar from "./EvaluationBar";
import { Arrow } from "react-chessboard/dist/chessboard/types";

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

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ChessBoard() {
  const {
    headerPGN,
    chessGamePGN,
    fen,
    boardFlipped,
    currentMoveIndex,
    currentAnalysis,
    report,
    showArrows,
  } = useChessInsightStore();
  const topPlayer = boardFlipped ? headerPGN?.White : headerPGN?.Black;
  const bottomPlayer = boardFlipped ? headerPGN?.Black : headerPGN?.White;
  const topPlayerElo = boardFlipped ? headerPGN?.WhiteElo : headerPGN?.BlackElo;
  const bottomPlayerElo = boardFlipped
    ? headerPGN?.BlackElo
    : headerPGN?.WhiteElo;

  const moves = chessGamePGN?.history({ verbose: true }) ?? [];
  const moveInfo = moves[currentMoveIndex - 1];

  const fromSquare = moveInfo?.from ?? "";
  const toSquare = moveInfo?.to ?? "";

  const classification =
    report?.moves[currentMoveIndex - 1]?.classification ?? "";
  const color =
    classificationColors[classification as keyof typeof classificationColors] ??
    "#000000";

  const customSquareStyles = {
    [fromSquare]: {
      backgroundColor: `${hexToRgba(color, 0.6)}`,
    },
    [toSquare]: {
      backgroundColor: `${hexToRgba(color, 0.6)}`,
    },
  };

  const customArrows: Arrow[] =
   showArrows && currentAnalysis?.from && currentAnalysis?.to
    ? [[currentAnalysis.from, currentAnalysis.to, "#96bc4b"] as Arrow]
    : [];


  return (
    <div className="flex items-center space-x-4">
      <EvaluationBar />
      <div className="w-[500px]">
        <PlayerCard
          playerName={topPlayer || "Anonymous"}
          playerRating={topPlayerElo || "0"}
          playerImage={""}
          cardPosition="top"
        />
        <Chessboard
          position={fen}
          arePiecesDraggable={false}
          boardWidth={500}
          customDarkSquareStyle={{ backgroundColor: "#b88767" }}
          customLightSquareStyle={{ backgroundColor: "#f6dfc0" }}
          boardOrientation={boardFlipped ? "black" : "white"}
          customSquareStyles={customSquareStyles}
          customArrows={customArrows}
        />
        <PlayerCard
          playerName={bottomPlayer || "Anonymous"}
          playerRating={bottomPlayerElo || "0"}
          playerImage={""}
          cardPosition="bottom"
        />
      </div>
    </div>
  );
}
