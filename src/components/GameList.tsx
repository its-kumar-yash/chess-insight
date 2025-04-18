"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge, BarChart3, Search, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { fetchUserAnalyzedGames } from "@/actions/game.action";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCard from "./GameCard";
import Link from "next/link";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const result = await fetchUserAnalyzedGames(10, 0);

      if (result.success) {
        setGames(result.games);
        setHasMore(result.hasMore);
      }
      setLoading(false);
    };
    loadGames();
  }, []);

  const loadMoreGames = async () => {
    const nextPage = page + 1;
    const result = await fetchUserAnalyzedGames(10, nextPage * 10);
    if (result.success) {
      setGames([...games, ...result.games]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    }
  };

  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => <GameCardSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-2 lg:col-span-3">
        <Card className="border-primary/20 mb-6 !bg-background !px-6">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                Game Analysis
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                View and manage your analyzed chess games
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="!px-0">
            {loading && games.length === 0 ? (
              <div className="grid gap-4">{renderSkeletons()}</div>
            ) : games.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <Zap className="h-8 w-8" />
                <h2 className="text-2xl font-semibold">
                  No analyzed games yet
                </h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Analyze your chess games to track your performance and improve
                  your play.
                </p>
                <Link href="/analyze">
                  <Button>Analyze a Game</Button>
                </Link>
              </div>
            ) : (
              <div className="">
                <div className="grid gap-4">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" onClick={loadMoreGames}>
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
