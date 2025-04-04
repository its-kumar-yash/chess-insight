import { Chess } from "chess.js";
import pgnParser from "pgn-parser";

// parse PGN and return game information
export function parsePGN(pgn: string) {
  try {
    console.log("Parsing PGN:", pgn);
    const chess = new Chess();
    let parsedPGN;
    try {
      let parsedArray = pgnParser.parse(pgn) as { [key: string]: any }[];
      if (!parsedArray) {
        console.error("Invalid PGN format.");
        return null;
      }
      console.log("Parsed PGN:", parsedArray);
      parsedPGN = parsedArray[0] as any;
    } catch (e) {
      console.log("Error parsing PGN:", e);
      return null;
    }

    if (!parsedPGN.moves || !Array.isArray(parsedPGN.moves)) {
      console.error("PGN does not contain valid moves.");
      return null;
    }

    chess.loadPgn(pgn);
    return chess;
  } catch (error) {
    console.error("Error parsing PGN:", error);
    return null;
  }
}
