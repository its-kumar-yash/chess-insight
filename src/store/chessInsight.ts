import {
  ChessGameResponse,
  Report,
  StockfishAnalysisResponse,
} from "@/lib/types";
import { Chess } from "chess.js";
import { create } from "zustand";

interface ChessInsightState {
  inputPGN: string;
  chessGamePGN: Chess | null; //chess game object when user enter pgn
  inputUsername: string;
  gameListByUsername: any[]; //list of games by username
  headerPGN: { [key: string]: string }; //header of pgn
  fen: string; //fen string of the current position
  currentAnalysis: StockfishAnalysisResponse | null; // stockfish analysis of current move
  analysisArray: StockfishAnalysisResponse[]; // array of stockfish analysis for all moves
  currentDepth: number; // current depth of analysis
  boardFlipped: boolean; // whether the board is flipped or not
  currentMoveIndex: number; // current move index in the game
  report: Report | null;
  loading: boolean; // loading state for the analysis
}

interface ChessInsightActions {
  setInputPGN: (inputPGN: string) => void;
  setChessGamePGN: (chessGamePGN: Chess | null) => void;
  setInputUsername: (inputUsername: string) => void;
  setGameListByUsername: (gameListByUsername: ChessGameResponse[]) => void;
  setHeaderPGN: (headerPGN: { [key: string]: string }) => void;
  setFen: (fen: string) => void;
  setCurrentAnalysis: (
    currentAnalysis: StockfishAnalysisResponse | null
  ) => void;
  setAnalysisArray: (analysisArray: StockfishAnalysisResponse[]) => void;
  setCurrentDepth: (currentDepth: number) => void;
  setBoardFlipped: (boardFlipped: boolean) => void;
  setCurrentMoveIndex: (currentMoveIndex: number) => void;
  setReport: (report: Report | null) => void;
  setLoading: (loading: boolean) => void;
}

const initialState: ChessInsightState = {
  inputPGN: "",
  chessGamePGN: null,
  inputUsername: "",
  gameListByUsername: [],
  headerPGN: {},
  fen: "start",
  currentAnalysis: null,
  analysisArray: [],
  currentDepth: 12,
  boardFlipped: false,
  currentMoveIndex: 0,
  report: null,
  loading: false,
};

export const useChessInsightStore = create<
  ChessInsightState & ChessInsightActions
>((set) => {
  return {
    ...initialState,
    setInputPGN: (inputPGN: string) => set((state) => ({ inputPGN })),
    setChessGamePGN: (chessGamePGN: Chess | null) =>
      set((state) => ({ chessGamePGN })),
    setInputUsername: (inputUsername: string) =>
      set((state) => ({ inputUsername })),
    setGameListByUsername: (gameListByUsername: any[]) =>
      set((state) => ({ gameListByUsername })),
    setHeaderPGN: (headerPGN: { [key: string]: string }) =>
      set((state) => ({ headerPGN })),
    setFen: (fen: string) => set((state) => ({ fen })),
    setCurrentAnalysis: (currentAnalysis: StockfishAnalysisResponse | null) =>
      set((state) => ({ currentAnalysis })),
    setAnalysisArray: (analysisArray: StockfishAnalysisResponse[]) =>
      set((state) => ({ analysisArray })),
    setCurrentDepth: (currentDepth: number) =>
      set((state) => ({ currentDepth })),
    setBoardFlipped: (boardFlipped: boolean) =>
      set((state) => ({ boardFlipped })),
    setCurrentMoveIndex: (currentMoveIndex: number) =>
      set((state) => ({ currentMoveIndex })),
    setReport: (report: Report | null) => set((state) => ({ report })),
    setLoading: (loading: boolean) => set((state) => ({ loading })),
  };
});
