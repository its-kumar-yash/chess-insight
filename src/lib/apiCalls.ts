import { ChessGameResponse, ResultType, StockfishAnalysisResponse } from "./types";

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const gamesPeriod = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

function padMonth(month: number) {
  return month.toString().padStart(2, "0");
}

function getChessComWinner(game: any) {
  const whiteResult = game.white.result;
  const blackResult = game.black.result;
  if (whiteResult === "win") return "white";
  if (blackResult === "win") return "black";
  else return "draw";
}

function getLichessWinner(game: any) {
  return game.winner;
}

// Fetching games from Chess.com
export async function fetchChessComGames(username: string) {
  try {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${
        gamesPeriod.year
      }/${padMonth(gamesPeriod.month)}`
    );

    const data = await res.json();

    // console.log("Chess.com games data:", data);

    return data.games.map((game: any) => ({
      platform: "chesscom",
      uuid: game.uuid || crypto.randomUUID(),
      white: {
        username: game.white.username,
        rating: game.white.rating.toString(),
      },
      black: {
        username: game.black.username,
        rating: game.black.rating.toString(),
      },
      timeClass: game.time_class,
      timeControl: game.time_control,
      pgn: game.pgn,
      url: game.url,
      eco: game.eco,
      fen: game.fen,
      endTime: game.end_time,
      result: `${game.white.result}-${game.black.result}`,
      winner: getChessComWinner(game),
    }));
  } catch (error) {
    console.error("Error fetching Chess.com games:", error);
    return [];
  }
}

//fetching lichess games
export async function fetchLichessGames(username: string) {
  let monthStart = new Date(
    `${gamesPeriod.year}-${padMonth(gamesPeriod.month)}-01T00:00:00Z`
  ).getTime();

  let daysInMonth = monthLengths[gamesPeriod.month - 1];

  if (gamesPeriod.month === 2 && gamesPeriod.year % 4 === 0) {
    daysInMonth = 29;
  }

  let monthEnd = new Date(
    `${gamesPeriod.year}-${padMonth(
      gamesPeriod.month
    )}-${daysInMonth}T23:59:59Z`
  ).getTime();

  try {
    const res = await fetch(
      `https://lichess.org/api/games/user/${username}?max=10&pgnInJson=true`,
      {
        headers: {
          Accept: "application/x-ndjson",
        },
      }
    );

    const text = await res.text();
    const games = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    // console.log("Lichess games data:", games);

    return games.map((game: any) => ({
      platform: "lichess",
      uuid: game.id || crypto.randomUUID(),
      white: {
        username: game.players.white.user?.name || "AI",
        rating: game.players.white.rating,
        aiLevel: game.players.white.aiLevel,
      },
      black: {
        username: game.players.black.user?.name || "AI",
        rating: game.players.black.rating,
        aiLevel: game.players.black.aiLevel,
      },
      timeClass: game.speed,
      timeControl: game.clock
        ? `${game.clock.initial}+${game.clock.increment}`
        : undefined,
      pgn: game.pgn,
      url: `https://lichess.org/${game.id}`,
      eco: game.opening?.eco,
      fen: undefined, // Lichess doesn't return FEN in this API
      endTime: game.lastMoveAt,
      result: game.status,
      winner: getLichessWinner(game),
    }));
  } catch (error) {
    console.error("Error fetching Lichess games:", error);
    return [];
  }
}

//stockfish analysis
export async function analyzeMoveWithStockfish(
  fen: string,
  depth: number = 12
) {
  try {
    const res = await fetch("https://chess-api.com/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen,
        depth,
        maxThinkingTime: 100,
        variants: 1,
      }),
    });

    const data: StockfishAnalysisResponse = await res.json();

    return data;
  } catch (error) {
    console.error("Error analyzing move with Stockfish:", error);
    return null;
  }
}

export async function analyzeMoveWithStockfishV2(
  fen: string,
  depth: number = 12
) {
  try {
    const res = await fetch("https://stockfish.online/api/s/v2.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fen,
        depth,
      }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error analyzing move with Stockfish:", error);
    return null;
  }
}
