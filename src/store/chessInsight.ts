import { Chess } from "chess.js";
import { create } from "zustand";

interface ChessInsightState {
  inputPGN: string;
  chessGamePGN: Chess | null; //chess game object when user enter pgn
  inputUsername: string;
  gameListByUsername: string[]; //list of games by username
}

interface ChessInsightActions {
  setInputPGN: (inputPGN: string) => void;
  setChessGamePGN: (chessGamePGN: Chess | null) => void;
  setInputUsername: (inputUsername: string) => void;
  setGameListByUsername: (gameListByUsername: string[]) => void;
}

const initialState: ChessInsightState = {
  inputPGN: "",
  chessGamePGN: null,
  inputUsername: "",
  gameListByUsername: [],
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
    setGameListByUsername: (gameListByUsername: string[]) =>
      set((state) => ({ gameListByUsername })),
  };
});
