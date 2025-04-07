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
  } = useChessInsightStore();

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
      };
    }

    const evalValue = currentAnalysis.eval;
    const mateValue = currentAnalysis.mate;

    // Handle mate scenarios
    if (mateValue !== null) {
      if (mateValue > 0) {
        // White has mate

        return {
          barHeight: 100, // 100% for mate
          evalText: `M${Math.abs(mateValue)}`,
          advantage: "white" as const,
        };
      } else {
        // Black has mate

        return {
          barHeight: 0, // 0% for mate (full black)
          evalText: `M${Math.abs(mateValue)}`,
          advantage: "black" as const,
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

      return { barHeight, evalText, advantage };
    }

    return {
      barHeight: 50,
      evalText: "0.0",
      advantage: "equal" as const,
    };
  };

  // Get display values
  const { barHeight, evalText, advantage } = calculateEvalDisplay();

  // Calculate which side is white based on board orientation
  const isWhiteOnBottom = !boardFlipped;

  // Calculate positions based on board orientation
  const whiteBarHeight = isWhiteOnBottom ? barHeight : 100 - barHeight;

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
            height: `${barHeight}%`,
            bottom: 0,
            top: "auto",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Black side bar */}
        <motion.div
          className="absolute w-full bg-black"
          animate={{
            height: `${100 - barHeight}%`,
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
            height: `${100 - (100 - barHeight)}%`,
            bottom: "auto",
            top: 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* White side bar */}
        <motion.div
          className="absolute w-full bg-black"
          animate={{
            height: `${100 - barHeight}%`,
            top: "auto",
            bottom: 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </>
    );
  }

  return (
    <div className="relative flex flex-col h-[500px] w-8 bg-neutral-300 border border-gray-700 rounded-sm overflow-hidden">
      {result}

      {/* Center line indicator */}
      <div className="absolute top-1/2 w-full h-[1px] bg-neutral-400"></div>

      {/* Evaluation text */}
      <div
        className={`absolute ${
          showEvalAtBottom ? "bottom-2" : "top-2"
        } left-1/2 transform -translate-x-1/2 px-1 py-0.5 text-xs font-medium rounded`}
        style={{
          backgroundColor:
            advantage === "white"
              ? "rgba(255, 255, 255, 0.9)"
              : advantage === "black"
              ? "rgba(0, 0, 0, 0.9)"
              : "rgba(200, 200, 200, 0.9)",
          color: advantage === "black" ? "white" : "black",
        }}
      >
        {currentMoveIndex !== 0 &&
        currentAnalysis &&
        currentAnalysis?.mate !== null
          ? `M${Math.abs(currentAnalysis.mate)}`
          : evalText}
      </div>
    </div>
  );
}
