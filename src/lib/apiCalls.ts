const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const gamesPeriod = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

function padMonth(month: number) {
  return month.toString().padStart(2, "0");
}

export async function fetchChessComGames(username: string) {
  try {
    const res = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${
        gamesPeriod.year
      }/${padMonth(gamesPeriod.month)}`
    );

    const data = await res.json();

    return data.games.map((game: any) => ({
      white: {
        username: game.white.username,
        rating: game.white.rating.toString(),
      },
      black: {
        username: game.black.username,
        rating: game.black.rating.toString(),
      },
      timeClass: game.time_class,
      pgn: game.pgn,
    }));


  } catch (error) {
    console.error("Error fetching Chess.com games:", error);
    return [];
  }
}

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

    return games.map((game: any) => ({
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
      pgn: game.pgn,
    }));

  } catch (error) {
    console.log("Error fetching Lichess games:", error);
    return [];
  }
}
