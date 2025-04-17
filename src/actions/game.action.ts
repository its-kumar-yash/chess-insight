"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ChessGameResponse,
  MoveReport,
  Report,
  StockfishAnalysisResponse,
} from "@/lib/types";

// save a chess game to the database
export async function saveGameAnalysis(
  gameData: ChessGameResponse,
  report: Report,
  analysisArray: StockfishAnalysisResponse[]
) {
  try {
    // verify user is authenticated
    const session = await auth();

    if (!session?.user) {
      return {
        error: "User not authenticated",
      };
    }

    const userId =
      session.user.id ??
      (() => {
        throw new Error("User ID is undefined");
      })();

    //create or update the analyzed game
    const analyzedGame = await prisma.analyzedGame.upsert({
      where: {
        userId_platform_uuid: {
          userId,
          platform: gameData.platform || "manual",
          uuid: gameData.uuid || `manual-${Date.now()}`,
        },
      },
      update: {
        // Game metadata
        pgn: gameData.pgn,
        timeClass: gameData.timeClass || "unknown",
        timeControl: gameData.timeControl || null,
        url: gameData.url || null,
        eco: gameData.eco || null,
        fen: gameData.fen || null,
        endTime: gameData.endTime ? BigInt(gameData.endTime) : null,
        date: gameData.date || null,
        result: gameData.result || null,
        winner: gameData.winner || null,

        // Player info
        whiteUsername: gameData.white.username,
        whiteRating:
          typeof gameData.white.rating === "string"
            ? parseInt(gameData.white.rating, 10)
            : gameData.white.rating,
        blackUsername: gameData.black.username,
        blackRating:
          typeof gameData.black.rating === "string"
            ? parseInt(gameData.black.rating, 10)
            : gameData.black.rating,

        // Analysis data
        whiteAccuracy: report.accuracies.white,
        blackAccuracy: report.accuracies.black,

        // White move classifications
        whiteBrilliant: report.classifications.white.brilliant,
        whiteGreat: report.classifications.white.great,
        whiteBest: report.classifications.white.best,
        whiteExcellent: report.classifications.white.excellent,
        whiteGood: report.classifications.white.good,
        whiteInaccuracy: report.classifications.white.inaccuracy,
        whiteMistake: report.classifications.white.mistake,
        whiteBlunder: report.classifications.white.blunder,
        whiteBook: report.classifications.white.book,
        whiteForced: report.classifications.white.forced,

        // Black move classifications
        blackBrilliant: report.classifications.black.brilliant,
        blackGreat: report.classifications.black.great,
        blackBest: report.classifications.black.best,
        blackExcellent: report.classifications.black.excellent,
        blackGood: report.classifications.black.good,
        blackInaccuracy: report.classifications.black.inaccuracy,
        blackMistake: report.classifications.black.mistake,
        blackBlunder: report.classifications.black.blunder,
        blackBook: report.classifications.black.book,
        blackForced: report.classifications.black.forced,
      },
      create: {
        userId,

        // Game metadata
        platform: gameData.platform || "manual",
        uuid: gameData.uuid || `manual-${Date.now()}`,
        pgn: gameData.pgn,
        timeClass: gameData.timeClass || "unknown",
        timeControl: gameData.timeControl || null,
        url: gameData.url || null,
        eco: gameData.eco || null,
        fen: gameData.fen || null,
        endTime: gameData.endTime ? BigInt(gameData.endTime) : null,
        date: gameData.date || null,
        result: gameData.result || null,
        winner: gameData.winner || null,

        // Player info
        whiteUsername: gameData.white.username,
        whiteRating:
          typeof gameData.white.rating === "string"
            ? parseInt(gameData.white.rating, 10)
            : gameData.white.rating,
        blackUsername: gameData.black.username,
        blackRating:
          typeof gameData.black.rating === "string"
            ? parseInt(gameData.black.rating, 10)
            : gameData.black.rating,

        // Analysis data
        whiteAccuracy: report.accuracies.white,
        blackAccuracy: report.accuracies.black,

        // White move classifications
        whiteBrilliant: report.classifications.white.brilliant,
        whiteGreat: report.classifications.white.great,
        whiteBest: report.classifications.white.best,
        whiteExcellent: report.classifications.white.excellent,
        whiteGood: report.classifications.white.good,
        whiteInaccuracy: report.classifications.white.inaccuracy,
        whiteMistake: report.classifications.white.mistake,
        whiteBlunder: report.classifications.white.blunder,
        whiteBook: report.classifications.white.book,
        whiteForced: report.classifications.white.forced,

        // Black move classifications
        blackBrilliant: report.classifications.black.brilliant,
        blackGreat: report.classifications.black.great,
        blackBest: report.classifications.black.best,
        blackExcellent: report.classifications.black.excellent,
        blackGood: report.classifications.black.good,
        blackInaccuracy: report.classifications.black.inaccuracy,
        blackMistake: report.classifications.black.mistake,
        blackBlunder: report.classifications.black.blunder,
        blackBook: report.classifications.black.book,
        blackForced: report.classifications.black.forced,
      },
    });

    // Delete existing move reports for this game
    await prisma.moveReport.deleteMany({
      where: {
        analyzedGameId: analyzedGame.id,
      },
    });

    // Add move reports
    if (report.moves && report.moves.length > 0) {
      // Make sure all required fields are present and properly formatted
      const validMoves = report.moves.filter(move => 
        move.moveIndex !== undefined && 
        move.fen !== undefined
      );
      
      if (validMoves.length > 0) {
        try {
          await prisma.moveReport.createMany({
            data: validMoves.map((move) => ({
              analyzedGameId: analyzedGame.id,
              moveIndex: move.moveIndex,
              fen: move.fen || "",  // Provide default values for potentially undefined fields
              classification: move.classification || "none",
              eval: typeof move.eval === 'number' ? move.eval : 0, // Replace null with default value 0
              mate: typeof move.mate === 'number' ? move.mate : 0, // Replace null with default value 0
            })),
          });
        } catch (error) {
          console.error("Error creating move reports:", error);
          // Continue execution even if move reports fail
        }
      }
    }

    return { success: true, gameId: analyzedGame.id };
  } catch (error) {
    console.error("Error saving game analysis:", error);
    return { error: "Failed to save game analysis" };
  }
}

// fetch all anlyzed games for a user
export async function fetchUserAnalyzedGames(limit = 10, skip = 0) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        error: "User not authenticated",
      };
    }

    const userId =
      session.user.id ??
      (() => {
        throw new Error("User ID is undefined");
      })();

    const games = await prisma.analyzedGame.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip,
    });

    const total = await prisma.analyzedGame.count({
      where: {
        userId,
      },
    });

    return {
      success: true,
      games,
      total,
      hasMore: total > limit + skip, // Check if there are more games to fetch
    };
  } catch (error) {
    console.error("Error fetching analyzed games:", error);
    return { error: "Failed to fetch analyzed games" };
  }
}

// fetch a specific analyzed game with its move reports
export async function fetchGameAnalysis(gameId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        error: "User not authenticated",
      };
    }

    const userId =
      session.user.id ??
      (() => {
        throw new Error("User ID is undefined");
      })();

    const game = await prisma.analyzedGame.findUnique({
      where: {
        id: gameId,
        userId,
      },
      include: {
        moves: {
          orderBy: {
            moveIndex: "asc",
          },
        },
      },
    });

    if (!game) {
      return {
        error: "Game not found",
      };
    }

    //reconstruct the report format
    const report: Report = {
      accuracies: {
        white: game.whiteAccuracy || 0,
        black: game.blackAccuracy || 0,
      },
      classifications: {
        white: {
          brilliant: game.whiteBrilliant,
          great: game.whiteGreat,
          best: game.whiteBest,
          excellent: game.whiteExcellent,
          good: game.whiteGood,
          inaccuracy: game.whiteInaccuracy,
          mistake: game.whiteMistake,
          blunder: game.whiteBlunder,
          book: game.whiteBook,
          forced: game.whiteForced,
        },
        black: {
          brilliant: game.blackBrilliant,
          great: game.blackGreat,
          best: game.blackBest,
          excellent: game.blackExcellent,
          good: game.blackGood,
          inaccuracy: game.blackInaccuracy,
          mistake: game.blackMistake,
          blunder: game.blackBlunder,
          book: game.blackBook,
          forced: game.blackForced,
        },
      },
      moves: game.moves as MoveReport[],
    };

    return {
      success: true,
      game: {
        ...game,
        endTime: game.endTime ? Number(game.endTime) : undefined,
      },
      report,
    };
  } catch (error) {
    console.error("Error fetching game analysis:", error);
    return { error: "Failed to fetch game analysis" };
  }
}

// fetch stats for dashboard
export async function fetchUserStats() {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        error: "User not authenticated",
      };
    }

    const userId =
      session.user.id ??
      (() => {
        throw new Error("User ID is undefined");
      })();

    // get total analyzed games
    const totalGames = await prisma.analyzedGame.count({
      where: {
        userId,
      },
    });

    // get average accuracy
    const avgAccuracy = await prisma.analyzedGame.aggregate({
      where: {
        userId,
        whiteAccuracy: {
          not: null,
        },
        blackAccuracy: {
          not: null,
        },
      },
      _avg: {
        whiteAccuracy: true,
        blackAccuracy: true,
      },
    });

    // get most common mistakes
    const recentGames = await prisma.analyzedGame.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        whiteBlunder: true,
        whiteMistake: true,
        whiteInaccuracy: true,
        blackBlunder: true,
        blackMistake: true,
        blackInaccuracy: true,
      },
    });

    const totalWhiteBlunders = recentGames.reduce(
      (sum, game) => sum + game.whiteBlunder,
      0
    );
    const totalWhiteMistakes = recentGames.reduce(
      (sum, game) => sum + game.whiteMistake,
      0
    );
    const totalWhiteInaccuracies = recentGames.reduce(
      (sum, game) => sum + game.whiteInaccuracy,
      0
    );
    const totalBlackBlunders = recentGames.reduce(
      (sum, game) => sum + game.blackBlunder,
      0
    );
    const totalBlackMistakes = recentGames.reduce(
      (sum, game) => sum + game.blackMistake,
      0
    );
    const totalBlackInaccuracies = recentGames.reduce(
      (sum, game) => sum + game.blackInaccuracy,
      0
    );

    return {
      success: true,
      stats: {
        totalGames,
        avgWhiteAccuracy: avgAccuracy._avg.whiteAccuracy || 0,
        avgBlackAccuracy: avgAccuracy._avg.blackAccuracy || 0,
        avgAccuracy:
          ((avgAccuracy._avg.whiteAccuracy || 0) +
            (avgAccuracy._avg.blackAccuracy || 0)) /
          2,
        recentMistakes: {
          white: {
            blunders: totalWhiteBlunders,
            mistakes: totalWhiteMistakes,
            inaccuracies: totalWhiteInaccuracies,
          },
          black: {
            blunders: totalBlackBlunders,
            mistakes: totalBlackMistakes,
            inaccuracies: totalBlackInaccuracies,
          },
        },
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { error: "Failed to fetch user stats" };
  }
}
