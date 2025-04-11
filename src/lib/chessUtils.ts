import { Chess } from "chess.js";
import pgnParser from "pgn-parser";
import { fetchChessComGames, fetchLichessGames } from "./apiCalls";
import { Classification } from "./types";

// parse PGN and return game information
export function parsePGN(pgn: string) {
  try {
    // console.log("Parsing PGN:", pgn);
    const chess = new Chess();
    let parsedPGN;
    let headerObject: { [key: string]: string } = {};
    try {
      let parsedArray = pgnParser.parse(pgn) as { [key: string]: any }[];
      if (!parsedArray) {
        console.error("Invalid PGN format.");
        return null;
      }
      // console.log("Parsed PGN:", parsedArray);
      parsedPGN = parsedArray[0] as any;

      // Convert header array to object
      if (parsedPGN.headers && Array.isArray(parsedPGN.headers)) {
        parsedPGN.headers.forEach((header: { name: string; value: string }) => {
          headerObject[header.name] = header.value;
        });
      }
      // Replace array headers with object format
      parsedPGN.headers = headerObject;
      // console.log("Parsed PGN Header as object:", headerObject);
    } catch (e) {
      console.log("Error parsing PGN:", e);
      return null;
    }

    if (!parsedPGN.moves || !Array.isArray(parsedPGN.moves)) {
      console.error("PGN does not contain valid moves.");
      return null;
    }

    chess.loadPgn(pgn);
    // Add the header object to the chess object
    chess.header = (...args: string[]) => headerObject;
    // console.log(chess);
    return chess;
  } catch (error) {
    console.error("Error parsing PGN:", error);
    return null;
  }
}

// get FEN from current position
export function getFEN(chess: Chess) {
  return chess.fen();
}

// get move history from current position
export function getMoveHistory(chess: Chess) {
  if (!chess) return [];
  return chess.history({ verbose: true });
}

export function getToPosition(chess: Chess, moveNumber: number) {
  const moves = getMoveHistory(chess);
  if (moveNumber < 0 || moveNumber > moves?.length) {
    console.error("Invalid move number:", moveNumber);
    return null;
  }
  const newChess = new Chess();
  for (let i = 0; i < moveNumber; i++) {
    newChess.move(moves[i]);
  }
  return newChess.fen();
}

//fetch user games from Lichess or chess
export async function fetchUserGames(username: string, platform: string) {
  if (!username || !platform) {
    console.error("Invalid username or platform.");
    return [];
  }

  if (platform === "Chess.com") {
    // Fetch games from Chess.com API
    return fetchChessComGames(username);
  } else if (platform === "Lichess") {
    // Fetch games from Lichess API
    return fetchLichessGames(username);
  } else {
    console.log(
      "Invalid platform. Please choose either 'Chess.com' or 'Lichess'."
    );
    return [];
  }
}

// Get the maximum evaluation loss for a classification to be applied
// Evaluation loss threshold for excellent in a previously equal position is 30
export function getEvaluationLossThreshold(
  classif: Classification,
  prevEval: number
) {
  const absPrev = Math.abs(prevEval);
  let threshold = 0;
  switch (classif) {
    case Classification.BRILLIANT:
      threshold = -0.0001 * absPrev * absPrev - 0.1 * absPrev - 20;
      break;
    case Classification.GREAT:
      threshold = 0.0001 * absPrev * absPrev + 0.05 * absPrev - 10.5455;
      break;
    case Classification.BEST:
      threshold = 0.0001 * absPrev * absPrev + 0.0236 * absPrev + 0;
      break;
    case Classification.EXCELLENT:
      threshold = 0.0002 * absPrev * absPrev + 0.1231 * absPrev + 27.5455;
      break;
    case Classification.GOOD:
      threshold = 0.0002 * absPrev * absPrev + 0.2643 * absPrev + 60.5455;
      break;
    case Classification.INACCURACY:
      threshold = 0.0002 * absPrev * absPrev + 0.3624 * absPrev + 108.0909;
      break;
    case Classification.MISTAKE:
      threshold = 0.0003 * absPrev * absPrev + 0.4027 * absPrev + 225.8182;
      break;
    default:
      threshold = Infinity;
  }
  return Math.max(threshold, 0);
}
