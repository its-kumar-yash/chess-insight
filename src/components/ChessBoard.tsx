"use client";

import React from "react";
import { Chessboard } from "react-chessboard";
import PlayerCard from "./PlayerCard";
import { useChessInsightStore } from "@/store/chessInsight";


export default function ChessBoard() {
  const { headerPGN } = useChessInsightStore();
  
  return (
    <div className="w-[500px]">
      <PlayerCard
        playerName={headerPGN?.Black || "Anonymous"}
        playerRating={headerPGN?.BlackElo || "0"}
        playerImage={""}
        cardPosition="top"
      />
      <Chessboard
        position="start"
        arePiecesDraggable={false}
        boardWidth={500}
        customDarkSquareStyle={{ backgroundColor: "#769656" }}
        customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
      />
      <PlayerCard
        playerName={headerPGN?.White || "Anonymous"}
        playerRating={headerPGN?.WhiteElo || "0"}
        playerImage={""}
        cardPosition="bottom"
      />
    </div>
  );
}
