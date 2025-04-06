"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import PlayerCard from "./PlayerCard";
import { useChessInsightStore } from "@/store/chessInsight";
import EvaluationBar from "./EvaluationBar";

export default function ChessBoard() {
  const { headerPGN, chessGamePGN, fen, boardFlipped } = useChessInsightStore();

  const topPlayer = boardFlipped ? headerPGN?.White : headerPGN?.Black;
  const bottomPlayer = boardFlipped ? headerPGN?.Black : headerPGN?.White;
  const topPlayerElo = boardFlipped ? headerPGN?.WhiteElo : headerPGN?.BlackElo;
  const bottomPlayerElo = boardFlipped
    ? headerPGN?.BlackElo
    : headerPGN?.WhiteElo;

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
          customDarkSquareStyle={{ backgroundColor: "#769656" }}
          customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
          boardOrientation={boardFlipped ? "black" : "white"}
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
