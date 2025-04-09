interface PlayerInfo {
  username: string;
  rating: string | number;
  aiLevel?: number; // only applicable for lichess api
}

export type ResultType = "white" | "black" | "draw" | "abandoned";

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

// Winning chance: value 50 (50%) means that position is equal.
// Over 50 - white is winning. Below 50 - black is winning. This is calculated using Lichess formula
// (Win% = 50 + 50 * (2 / (1 + exp(-0.00368208 * centipawns)) - 1)).
// Values are similar to what evaluation bar shows on most of chess websites.

export interface StockfishAnalysisResponse {
  success?: boolean;
  text: string;
  eval: number;
  move?: string; // best move
  bestMove?: string; // best move in UCI format
  fen?: string; // position after the move
  depth?: number; // depth of the analysis
  winChance?: number; // win chance for the player to move
  continuationArr: string[]; // array of best moves
  mate: number | null; // mate in X moves
  centipawns?: string; // centipawn value of the best move

  san?: string; // standard algebraic notation of the best move
  lan?: string; // long algebraic notation of the best move
  turn?: string; // turn of the player to move
  color?: string; // color of the player to move
  piece?: string; // piece to move
  flags?: string; // flags of the move
  isCapture?: boolean; // is the move a capture
  isCastling?: boolean; // is the move a castling
  isPromotion?: boolean; // is the move a promotion

  from?: string; // from square of the move
  to?: string; // to square of the move
  fromNumeric?: string; // from square in numeric format
  toNumeric?: string; // to square in numeric format

  taskId?: string; // task id of the analysis
  time?: number; // time taken for the analysis
  type?: string; // type of the analysis (move, check, checkmate, stalemate, etc.)
  classification?: Classification; // Added classification field
}

// {"success":true,
//   "evaluation":1.36,
//   "mate":null,
//   "bestmove":"bestmove b7b6 ponder f3e5",
//   "continuation":"b7b6 f3e5 h7h6 g5f6 f8f6 d2f3"}

// Chess.com response example
// {
//   "url": "https://www.chess.com/game/live/136905110870",
//   "pgn": "[Event \"Live Chess\"]\n[Site \"Chess.com\"]\n[Date \"2025.04.01\"]\n[Round \"-\"]\n[White \"Aladdjones\"]\n[Black \"itsyashkumar\"]\n[Result \"0-1\"]\n[CurrentPosition \"r2r4/1p1k3p/4Nn2/p1Bp4/1P2P3/P1PB3P/5PP1/R4RK1 w - -\"]\n[Timezone \"UTC\"]\n[ECO \"B15\"]\n[ECOUrl \"https://www.chess.com/openings/Caro-Kann-Defense-2.d4-d5-3.Nc3-a6\"]\n[UTCDate \"2025.04.01\"]\n[UTCTime \"10:36:45\"]\n[WhiteElo \"753\"]\n[BlackElo \"760\"]\n[TimeControl \"600\"]\n[Termination \"itsyashkumar won - game abandoned\"]\n[StartTime \"10:36:45\"]\n[EndDate \"2025.04.01\"]\n[EndTime \"10:49:28\"]\n[Link \"https://www.chess.com/game/live/136905110870\"]\n\n1. e4 {[%clk 0:09:58.4]} 1... c6 {[%clk 0:09:59.5]} 2. d4 {[%clk 0:09:53.7]} 2... d5 {[%clk 0:09:59.1]} 3. Nc3 {[%clk 0:09:43.3]} 3... a6 {[%clk 0:09:32.3]} 4. Bf4 {[%clk 0:09:36.9]} 4... Be6 {[%clk 0:09:13.9]} 5. Bd3 {[%clk 0:09:12.1]} 5... c5 {[%clk 0:08:53]} 6. dxc5 {[%clk 0:08:20.4]} 6... Nc6 {[%clk 0:08:50.2]} 7. Nf3 {[%clk 0:08:13.8]} 7... Bg4 {[%clk 0:08:47.7]} 8. h3 {[%clk 0:08:03]} 8... Bxf3 {[%clk 0:08:46.8]} 9. Qxf3 {[%clk 0:06:45.6]} 9... Nd4 {[%clk 0:08:31.2]} 10. Qd1 {[%clk 0:06:13.8]} 10... e6 {[%clk 0:08:18.3]} 11. O-O {[%clk 0:05:59.3]} 11... Bxc5 {[%clk 0:08:09.9]} 12. Qg4 {[%clk 0:05:13.7]} 12... Nf6 {[%clk 0:08:03.2]} 13. Qxg7 {[%clk 0:05:09.1]} 13... Ne2+ {[%clk 0:07:40.9]} 14. Nxe2 {[%clk 0:05:04.6]} 14... Kd7 {[%clk 0:07:26.5]} 15. Qxf7+ {[%clk 0:04:48.8]} 15... Kc6 {[%clk 0:07:20.3]} 16. Qxe6+ {[%clk 0:04:45.8]} 16... Bd6 {[%clk 0:07:04.7]} 17. Nd4+ {[%clk 0:04:38.1]} 17... Kc5 {[%clk 0:06:57.7]} 18. c3 {[%clk 0:04:29.4]} 18... Re8 {[%clk 0:06:45.5]} 19. b4+ {[%clk 0:04:03.9]} 19... Kb6 {[%clk 0:06:40.7]} 20. Qxd6+ {[%clk 0:03:56.5]} 20... Qxd6 {[%clk 0:06:35.1]} 21. Bxd6 {[%clk 0:03:24.5]} 21... a5 {[%clk 0:06:23.4]} 22. a3 {[%clk 0:03:15.8]} 22... Red8 {[%clk 0:05:58.5]} 23. Bc5+ {[%clk 0:03:04.7]} 23... Kc7 {[%clk 0:05:52.6]} 24. Ne6+ {[%clk 0:03:00.3]} 24... Kd7 {[%clk 0:05:41.8]} 0-1\n",
//   "time_control": "600",
//   "end_time": 1743504568,
//   "rated": true,
//   "tcn": "mCYQlBZJbsWOcD6SftQIBI5QgvSEpxEvdvQBvd0Seg9IdE!TE2Bmsm8Z21ZQ1SIRmBQIks?8jzIPSR7RDROGiq87RIPYBSYZ",
//   "uuid": "35681b4d-0ee5-11f0-ab42-9cb3b601000f",
//   "initial_setup": "",
//   "fen": "r2r4/1p1k3p/4Nn2/p1Bp4/1P2P3/P1PB3P/5PP1/R4RK1 w - -",
//   "time_class": "rapid",
//   "rules": "chess",
//   "white": {
//       "rating": 753,
//       "result": "abandoned",
//       "@id": "https://api.chess.com/pub/player/aladdjones",
//       "username": "Aladdjones",
//       "uuid": "3cbcd490-597c-11e8-8060-000000000000"
//   },
//   "black": {
//       "rating": 760,
//       "result": "win",
//       "@id": "https://api.chess.com/pub/player/itsyashkumar",
//       "username": "itsyashkumar",
//       "uuid": "3c3199f8-6b86-11ee-b15c-7bc79315afa7"
//   },
//   "eco": "https://www.chess.com/openings/Caro-Kann-Defense-2.d4-d5-3.Nc3-a6"
// }

// Lichess response example
// {
//   "id": "2jocg6M2",
//   "rated": true,
//   "variant": "standard",
//   "speed": "rapid",
//   "perf": "rapid",
//   "createdAt": 1743830543347,
//   "lastMoveAt": 1743831312370,
//   "status": "mate",
//   "source": "pool",
//   "players": {
//       "white": {
//           "user": {
//               "name": "belami007",
//               "id": "belami007"
//           },
//           "rating": 953,
//           "ratingDiff": -6
//       },
//       "black": {
//           "user": {
//               "name": "itsyashkumar",
//               "id": "itsyashkumar"
//           },
//           "rating": 909,
//           "ratingDiff": 47,
//           "provisional": true
//       }
//   },
//   "winner": "black",
//   "moves": "d4 c6 g3 d5 Bg2 Bg4 f3 Bf5 f4 e6 Nf3 Bg4 O-O Bxf3 Bxf3 c5 dxc5 Bxc5+ Be3 Bxe3+ Kg2 Nf6 Qd3 Bc5 Qb5+ Nbd7 Na3 a6 Qxb7 O-O f5 Ne5 Qb3 Nxf3 exf3 e5 Rad1 d4 Qc4 Rc8 Qxa6 Bxa3 bxa3 Rxc2+ Rf2 Rxf2+ Kxf2 Qd6 Qb7 Rb8 Qa7 d3 Ke3 Qd4+ Kd2 Qxa7 Kxd3 Qd4+ Ke2 Rb2+ Ke1 Qc3+ Kf1 Qxf3+ Ke1 Qh1#",
//   "pgn": "[Event \"Rated rapid game\"]\n[Site \"https://lichess.org/2jocg6M2\"]\n[Date \"2025.04.05\"]\n[White \"belami007\"]\n[Black \"itsyashkumar\"]\n[Result \"0-1\"]\n[GameId \"2jocg6M2\"]\n[UTCDate \"2025.04.05\"]\n[UTCTime \"05:22:23\"]\n[WhiteElo \"953\"]\n[BlackElo \"909\"]\n[WhiteRatingDiff \"-6\"]\n[BlackRatingDiff \"+47\"]\n[Variant \"Standard\"]\n[TimeControl \"600+0\"]\n[ECO \"A40\"]\n[Termination \"Normal\"]\n\n1. d4 c6 2. g3 d5 3. Bg2 Bg4 4. f3 Bf5 5. f4 e6 6. Nf3 Bg4 7. O-O Bxf3 8. Bxf3 c5 9. dxc5 Bxc5+ 10. Be3 Bxe3+ 11. Kg2 Nf6 12. Qd3 Bc5 13. Qb5+ Nbd7 14. Na3 a6 15. Qxb7 O-O 16. f5 Ne5 17. Qb3 Nxf3 18. exf3 e5 19. Rad1 d4 20. Qc4 Rc8 21. Qxa6 Bxa3 22. bxa3 Rxc2+ 23. Rf2 Rxf2+ 24. Kxf2 Qd6 25. Qb7 Rb8 26. Qa7 d3 27. Ke3 Qd4+ 28. Kd2 Qxa7 29. Kxd3 Qd4+ 30. Ke2 Rb2+ 31. Ke1 Qc3+ 32. Kf1 Qxf3+ 33. Ke1 Qh1# 0-1\n\n\n",
//   "clock": {
//       "initial": 600,
//       "increment": 0,
//       "totalTime": 600
//   }
// }

// Stockfish response example
// {
//   text: "Move b7 → b8 (b8=Q+): [-11.62]. Black is winning. Depth 12.",
//   eval: -11.62,
//   move: "b7b8q",
//   fen: "8/1P1R4/n1r2B2/3Pp3/1k4P1/6K1/Bppr1P2/2q5 w - - 0 1",
//   depth: 12,
//   winChance: 1.3672836783305158,
//   continuationArr: (5) ['a6c5', 'b7b8q', 'c6b6', 'b8b6', 'b4a3'],
//   mate: null,
//   centipawns: "-1162",

//   san: "b8=Q+",
//   lan: "b7b8q",
//   turn: "w",
//   color: "w",
//   piece: "p",
//   flags: "np",
//   isCapture: false,
//   isCastling: false,
//   isPromotion: true,

//   from: "b7",
//   to: "b8",
//   fromNumeric: "27",
//   toNumeric: "28",

//   taskId: "0k1pkg83g",
//   time: 10677,
//   type: "move"
// }

//classification
export enum Classification {
  BRILLIANT = "brilliant",
  GREAT = "great",
  BEST = "best",
  GOOD = "good",
  EXCELLENT = "excellent",
  INACCURACY = "inaccuracy",
  MISTAKE = "mistake",
  BLUNDER = "blunder",
  BOOK = "book",
  FORCED = "forced",
}

export const classificationValues = {
  [Classification.BLUNDER]: 0,
  [Classification.MISTAKE]: 0.2,
  [Classification.INACCURACY]: 0.4,
  [Classification.GOOD]: 0.65,
  [Classification.EXCELLENT]: 0.9,
  [Classification.BEST]: 1,
  [Classification.GREAT]: 1,
  [Classification.BRILLIANT]: 1,
  [Classification.BOOK]: 1,
  [Classification.FORCED]: 1,
};

// Classification types with no special rules
export const centipawnClassifications = [
  Classification.BEST,
  Classification.EXCELLENT,
  Classification.GOOD,
  Classification.INACCURACY,
  Classification.MISTAKE,
  Classification.BLUNDER,
];

export interface EvaluatedPosition {
  fen: string;
  move?: {
    uci: string;
    san: string;
  };
  topLines: Array<{
    id: number;
    depth: number;
    evaluation: {
      type: string;
      value: number;
    };
    moveUCI: string;
    moveSAN?: string;
  }>;
  cutoffEvaluation?: {
    type: string;
    value: number;
  };
  worker?: string;
  opening?: string;
  classification?: Classification;
}

export interface MoveClassifications {
  brilliant: number;
  great: number;
  best: number;
  excellent: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
  book: number;
  forced: number;
}

export interface PlayerAccuracies {
  white: number;
  black: number;
}

export interface PlayerClassifications {
  white: MoveClassifications;
  black: MoveClassifications;
}

export interface MoveReport {
  moveIndex: number;
  fen: string;
  classification: Classification;
  eval: number; //centipawn value of the best move
  mate: number | null;
}

export interface Report {
  accuracies: PlayerAccuracies;
  classifications: PlayerClassifications;
  moves: MoveReport[];
}


