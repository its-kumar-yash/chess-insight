"use client";

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import PlayerCard from "./PlayerCard";
import { useChessInsightStore } from "@/store/chessInsight";
import { getMoveHistory } from "@/lib/chessUtils";
import { Chess } from "chess.js";

export default function ChessBoard() {
  const { headerPGN, chessGamePGN, fen } = useChessInsightStore();

  return (
    <div className="w-[500px]">
      <PlayerCard
        playerName={headerPGN?.Black || "Anonymous"}
        playerRating={headerPGN?.BlackElo || "0"}
        playerImage={""}
        cardPosition="top"
      />
      <Chessboard
        position={fen}
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
