import { getEvaluationLossThreshold } from "./chessUtils";
import {
  centipawnClassifications,
  Classification,
  classificationValues,
  MoveReport,
  Report,
  StockfishAnalysisResponse,
} from "./types";
import openings from "../resource/opening.json"

export function classify(
  currentPosition: StockfishAnalysisResponse,
  previousPosition: StockfishAnalysisResponse
) {
  // If no previous position available, mark as BOOK
  if (!previousPosition) {
    return Classification.BOOK;
  }

  //handle forced moves
  if (currentPosition.bestMove && currentPosition.move === currentPosition.bestMove) {
    return Classification.BRILLIANT;
  }

  if (currentPosition.continuationArr && currentPosition.continuationArr.length === 1) {
    return Classification.FORCED;
  }

  // handle mayes scores specially
  if (previousPosition.mate !== null || currentPosition !== null) {
    //basic classification for mate situation
    if (previousPosition.mate === null && currentPosition.mate !== null) {
      return currentPosition.mate > 0
        ? Classification.BRILLIANT
        : Classification.BLUNDER;
    } else if (
      previousPosition.mate !== null &&
      currentPosition.mate === null
    ) {
      //lost a chance to mate
      return previousPosition.mate < 0
        ? Classification.BEST
        : Classification.BLUNDER;
    } else if (
      previousPosition.mate !== null &&
      currentPosition.mate !== null
    ) {
      //both positions have mate
      if (
        Math.sign(previousPosition.mate) === Math.sign(currentPosition.mate)
      ) {
        // same side has mate, check if its faster or slower
        if (Math.abs(currentPosition.mate) < Math.sign(currentPosition.mate)) {
          return Classification.BEST;
        } else if (
          Math.abs(currentPosition.mate) === Math.abs(previousPosition.mate)
        ) {
          return Classification.EXCELLENT; // Same mate length, still good
        } else {
          return Classification.GOOD;
        }
      } else {
        //mate switches sides
        return Classification.BLUNDER;
      }
    }
  }

  //for normal eval position
  const moveColor = currentPosition.turn === "b" ? "w" : "b";
  const sign = moveColor === "w" ? 1 : -1;

  // calculate eval loss (positive means position got worse for the player who moves)
  let evalLoss = sign * (previousPosition.eval - currentPosition.eval);
  if (evalLoss < -50) {
    return Classification.BRILLIANT;
  }
  // 7. If the move almost doesn’t hurt – or even slightly improves – the position
  if (evalLoss >= -50 && evalLoss <= 10) {
    return Classification.GREAT;
  }
  if (evalLoss <= 10) return Classification.BEST;
  if (evalLoss <= 30) return Classification.EXCELLENT;
  if (evalLoss <= 70) return Classification.GOOD;
  if (evalLoss <= 150) return Classification.INACCURACY;
  if (evalLoss <= 300) return Classification.MISTAKE;
  return Classification.BLUNDER;
}

// Function to generate a move report based on the analysis array
export function generateMoveReport(analysisArray: StockfishAnalysisResponse[]) {
  //add classification to each move
  for (let i = 0; i < analysisArray.length; i++) {
    analysisArray[i].classification = classify(
      analysisArray[i],
      analysisArray[i - 1]
    );
  }

  // Calculate statistics for the report
  const accuracies = {
    white: { current: 0, maximum: 0 },
    black: { current: 0, maximum: 0 },
  };

  const classifications = {
    white: {
      brilliant: 0,
      great: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
      book: 0,
      forced: 0,
    },
    black: {
      brilliant: 0,
      great: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
      book: 0,
      forced: 0,
    },
  };

  for (let i = 0; i < analysisArray.length; i++) {
    const analysis = analysisArray[i];
    if (!analysis.classification) continue;

    let opening = openings.find((opening) => analysisArray[i].fen?.includes(opening.fen));
    analysisArray[i].opening = opening?.name;
    console.log("opening", opening?.name, analysisArray[i].fen);

    //determine which  player made this move
    const moveColor = i % 2 == 1 ? "white" : "black";

    //update classification counts
    classifications[moveColor][
      analysis.classification.toLowerCase() as keyof typeof classifications.white
    ] += 1;

    accuracies[moveColor].current +=
      classifications[moveColor][
        analysis.classification.toLowerCase() as keyof typeof classifications.white
      ];
    accuracies[moveColor].maximum += 1;
  }

  //calculate final accuracies as percentages
  const reportAccuracies = {
    white:
      accuracies.white.maximum > 0
        ? Math.min(
            (accuracies.white.current / accuracies.white.maximum) * 100,
            100
          )
        : 0,
    black:
      accuracies.black.maximum > 0
        ? Math.min(
            (accuracies.black.current / accuracies.black.maximum) * 100,
            100
          )
        : 0,
  };

  // convert analysis array to evaluated position format for the report
  const positions = analysisArray.map((analysis) => ({
    fen: analysis.fen || "",
    topLines: [
      {
        id: 1,
        depth: analysis.depth || 0,
        evaluation: {
          type: analysis.mate !== null ? "mate" : "cp",
          value: analysis.mate !== null ? analysis.mate : analysis.eval,
        },
        moveUCI: analysis.bestMove || "",
        moveSAN: analysis.san || "",
      },
    ],
    classification: analysis.classification,
  }));

  return {
    accuracies: reportAccuracies,
    classifications,
    positions,
  };
}

// generate a report from the analysis array
export function generateReport(analysisArray: StockfishAnalysisResponse[]) {
  const moves: MoveReport[] = [];

  const whiteStats = { current: 0, maximum: 0 };
  const blackStats = { current: 0, maximum: 0 };

  const initClassifs = {
    [Classification.BRILLIANT]: 0,
    [Classification.GREAT]: 0,
    [Classification.BEST]: 0,
    [Classification.EXCELLENT]: 0,
    [Classification.GOOD]: 0,
    [Classification.INACCURACY]: 0,
    [Classification.MISTAKE]: 0,
    [Classification.BLUNDER]: 0,
    [Classification.BOOK]: 0,
    [Classification.FORCED]: 0,
  };

  const whiteClassifs: Record<Classification, number> = { ...initClassifs };
  const blackClassifs: Record<Classification, number> = { ...initClassifs };

  for (let i = 1; i < analysisArray.length; i++) {
    const prev = analysisArray[i - 1];
    const curr = analysisArray[i];

    const moveColour = curr.turn === "b" ? "white" : "black";

    // Initialize with a default classification
    let classification: Classification;

    // First check if it's a best move match
    if (curr.bestMove && curr.move === curr.bestMove) {
      classification = Classification.BEST;
    } else {
      // Only classify based on evaluation if it's not already classified as BEST
      const prevEval = parseInt(prev.centipawns || "0");
      const currEval = parseInt(curr.centipawns || "0");
      let evalLoss =
        moveColour === "white" ? prevEval - currEval : currEval - prevEval;

      // Find the appropriate classification based on eval loss
      classification = Classification.BLUNDER; // Default to worst case
      for (let classif of centipawnClassifications) {
        const threshold = getEvaluationLossThreshold(classif, prevEval);
        if (evalLoss <= threshold) {
          classification = classif;
          break;
        }
      }
    }

    // Update stats based on the single classification
    if (moveColour === "white") {
      whiteStats.current += classificationValues[classification];
      whiteStats.maximum++;
      whiteClassifs[classification]++;
    } else {
      blackStats.current += classificationValues[classification];
      blackStats.maximum++;
      blackClassifs[classification]++;
    }

    moves.push({
      moveIndex: i,
      fen: curr.fen || "",
      classification,
      eval: curr.eval,
      mate: curr.mate,
    });
  }

  return {
    accuracies: {
      white: whiteStats.maximum
        ? (whiteStats.current / whiteStats.maximum) * 100
        : 0,
      black: blackStats.maximum
        ? (blackStats.current / blackStats.maximum) * 100
        : 0,
    },
    classifications: {
      white: whiteClassifs,
      black: blackClassifs,
    },
    moves,
  };
}
