export interface ChessGameResponse {
  white: {
    username: string | null;
    rating: string | number;
    aiLevel?: number;
  };
  black: {
    username: string | null;
    rating: string | number;
    aiLevel?: number;
  };
  timeClass: string;
  pgn: string;
  date?: string;
  result?: string;
}
