import { ChessGameResponse } from "@/lib/types";
import { Chess } from "chess.js";
import { create } from "zustand";

interface ChessInsightState {
  inputPGN: string;
  chessGamePGN: Chess | null; //chess game object when user enter pgn
  inputUsername: string;
  gameListByUsername: any[]; //list of games by username
  headerPGN: { [key: string]: string }; //header of pgn
}

interface ChessInsightActions {
  setInputPGN: (inputPGN: string) => void;
  setChessGamePGN: (chessGamePGN: Chess | null) => void;
  setInputUsername: (inputUsername: string) => void;
  setGameListByUsername: (gameListByUsername: ChessGameResponse[]) => void;
  setHeaderPGN: (headerPGN: { [key: string]: string }) => void;
}

const initialState: ChessInsightState = {
  inputPGN: "",
  chessGamePGN: null,
  inputUsername: "",
  gameListByUsername: [],
  headerPGN: {},
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
  };
});
