import { Chess } from "chess.js";
import { create } from "zustand";

interface ChessInsightState {
  inputPGN: string;
  chessGamePGN: Chess | null; //chess game object when user enter pgn
  inputUsername: string;
  gameListByUsername: string[]; //list of games by username
  headerPGN: { [key: string]: string }; //header of pgn
}

interface ChessInsightActions {
  setInputPGN: (inputPGN: string) => void;
  setChessGamePGN: (chessGamePGN: Chess | null) => void;
  setInputUsername: (inputUsername: string) => void;
  setGameListByUsername: (gameListByUsername: string[]) => void;
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
    setGameListByUsername: (gameListByUsername: string[]) =>
      set((state) => ({ gameListByUsername })),
    setHeaderPGN: (headerPGN: { [key: string]: string }) =>
      set((state) => ({ headerPGN })),
  };
});
