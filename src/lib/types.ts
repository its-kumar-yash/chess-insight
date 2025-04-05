interface PlayerInfo {
  username: string;
  rating: string | number;
  aiLevel?: number; // only applicable for lichess api
}

export type ResultType =  "white" | "black" | "draw" | "abandoned";

export interface ChessGameResponse {
  platform: "lichess" | "chesscom";
  uuid: string;
  white: PlayerInfo;
  black: PlayerInfo;
  timeClass: string;
  timeControl?: string;
  pgn: string;
  url?: string;
  eco?: string;
  fen?: string;
  endTime?: number;
  date?: string;
  result?: string;
  winner: ResultType;
}
