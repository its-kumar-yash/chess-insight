"use client";

import { useChessInsightStore } from "@/store/chessInsight";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function EvaluationBar() {
  const {
    currentAnalysis,
    boardFlipped,
    chessGamePGN,
    currentMoveIndex,
    analysisArray,
    headerPGN,
  } = useChessInsightStore();

  // Check if this is the last move
  const isLastMove = () => {
    if (!analysisArray || analysisArray.length === 0) return false;
    return currentMoveIndex === analysisArray.length - 1;
  };

  // Calculate evaluation display values directly from currentAnalysis
  const calculateEvalDisplay = () => {
    if (
      currentAnalysis === null ||
      chessGamePGN === null ||
      currentMoveIndex === 0
    ) {
      return {
        barHeight: 50,
        evalText: "0.0",
        advantage: "equal" as const,
        isCheckmate: false,
      };
    }

    const evalValue = currentAnalysis.eval;
    const mateValue = currentAnalysis.mate;
    const lastMove = isLastMove();

    // Handle mate scenarios
    if (mateValue !== null) {
      if (mateValue > 0) {
        // White has mate
        return {
          barHeight: 100, // 100% for mate
          evalText: lastMove ? "M" : `M${Math.abs(mateValue)}`,
          advantage: "white" as const,
          isCheckmate: lastMove && mateValue === 1, // True if last move and mate in 1
        };
      } else {
        // Black has mate
        return {
          barHeight: 0, // 0% for mate (full black)
          evalText: lastMove ? "M" : `M${Math.abs(mateValue)}`,
          advantage: "black" as const,
          isCheckmate: lastMove && mateValue === -1, // True if last move and mate in 1
        };
      }
    }

    // Handle regular evaluation
    if (evalValue !== undefined) {
      // Convert eval to percentage using a linear scale
      // Cap at 5-95% for visual clarity
      // +5 is advantage to white, -5 is advantage to black
      let barHeight = 50 + evalValue * 5; // 5% per pawn advantage
      barHeight = Math.min(95, Math.max(5, barHeight));

      const evalText = Math.abs(evalValue).toFixed(1);

      let advantage: "white" | "black" | "equal" = "equal";
      if (evalValue > 0.2) {
        advantage = "white";
      } else if (evalValue < -0.2) {
        advantage = "black";
      }

      return { barHeight, evalText, advantage, isCheckmate: false };
    }

    return {
      barHeight: 50,
      evalText: "0.0",
      advantage: "equal" as const,
      isCheckmate: false,
    };
  };

  // Get display values
  const { barHeight, evalText, advantage, isCheckmate } = calculateEvalDisplay();
  const winner = headerPGN?.Result;
  
  // For last move with checkmate, show full bar in winner's color
  let effectiveBarHeight = barHeight; // Default to calculated bar height

  if (isLastMove()) {
    if (winner === "1-0") {
      // White wins, so 100% white bar
      effectiveBarHeight = 100;
    } else if (winner === "0-1") {
      // Black wins, so 0% white bar (100% black)
      effectiveBarHeight = 0;
    } else if (winner === "1/2-1/2") {
      // Draw, so 50/50
      effectiveBarHeight = 50;
    }
  }

  // Calculate which side is white based on board orientation
  const isWhiteOnBottom = !boardFlipped;

  // Determine which side to show the evaluation text
  const showEvalAtBottom =
    (advantage === "white" && isWhiteOnBottom) ||
    (advantage === "black" && !isWhiteOnBottom);

  let result;

  if (!boardFlipped) {
    //white on bottom
    result = (
      <>
        <motion.div
          className="absolute w-full bg-white"
          animate={{
            height: `${effectiveBarHeight}%`,
            bottom: 0,
            top: "auto",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Black side bar */}
        <motion.div
          className="absolute w-full bg-black"
          animate={{
            height: `${100 - effectiveBarHeight}%`,
            top: 0,
            bottom: "auto",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </>
    );
  } else if (boardFlipped) {
    //black on bottom
    result = (
      <>
        <motion.div
          className="absolute w-full bg-white"
          animate={{
            height: `${effectiveBarHeight}%`,
            bottom: "auto",
            top: 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Black side bar */}
        <motion.div
          className="absolute w-full bg-black"
          animate={{
            height: `${100 - effectiveBarHeight}%`,
            top: "auto",
            bottom: 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </>
    );
  }

  // Determine text to show based on game state
  let displayText = evalText;
  if (currentMoveIndex !== 0 && currentAnalysis && currentAnalysis.mate !== null) {
    displayText = isLastMove() ? "M" : `M${Math.abs(currentAnalysis.mate)}`;
  }
  
  // On last move, use the winner result to determine the text color
  let textBgColor = "rgba(200, 200, 200, 0.9)";
  let textColor = "black";
  
  if (isLastMove()) {
    if (winner === "1-0") {
      textBgColor = "rgba(255, 255, 255, 0.9)";
      textColor = "black";
    } else if (winner === "0-1") {
      textBgColor = "rgba(0, 0, 0, 0.9)";
      textColor = "white";
    }
  } else {
    textBgColor = 
      advantage === "white"
        ? "rgba(255, 255, 255, 0.9)"
        : advantage === "black"
        ? "rgba(0, 0, 0, 0.9)"
        : "rgba(200, 200, 200, 0.9)";
    textColor = advantage === "black" ? "white" : "black";
  }

  return (
    <div className="relative flex flex-col h-[500px] w-8 bg-neutral-300 border border-gray-700 rounded-sm overflow-hidden">
      {result}

      {/* Center line indicator - hide when in final position with a decisive result */}
      {!(isLastMove() && winner !== "1/2-1/2") && (
        <div className="absolute top-1/2 w-full h-[1px] bg-neutral-400"></div>
      )}
  
      {/* Evaluation text */}
      <div
        className={`absolute ${
          showEvalAtBottom ? "bottom-2" : "top-2"
        } left-1/2 transform -translate-x-1/2 px-1 py-0.5 text-xs font-medium rounded`}
        style={{
          backgroundColor: textBgColor,
          color: textColor
        }}
      >
        {displayText}
      </div>
    </div>
  );
} 