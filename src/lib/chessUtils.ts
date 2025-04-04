import { Chess } from "chess.js";
import pgnParser from "pgn-parser";

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
  if (moveNumber < 0 || moveNumber >= moves?.length) {
    console.error("Invalid move number:", moveNumber);
    return null;
  }
  const newChess = new Chess();
  for (let i = 0; i < Math.min(moveNumber, moves.length); i++) {
    newChess.move(moves[i]);
  }
  return newChess.fen();
}
