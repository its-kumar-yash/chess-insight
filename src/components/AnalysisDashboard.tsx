"use client";

import { fetchUserAnalyzedGames, fetchUserStats } from "@/actions/game.action";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { BarChart3, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";


interface AnalyzedGameCardProps {
    game: any;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const AnalyzedGameCard: React.FC<AnalyzedGameCardProps> = ({ game }) => {
    return (
      <Card className="w-full hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">
              {game.whiteUsername} vs {game.blackUsername}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {formatDate(game.createdAt)}
            </span>
          </div>
          <CardDescription className="text-xs">
            {game.timeClass} • {game.result || "?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                <span className="text-sm">{game.whiteAccuracy?.toFixed(1)}%</span>
              </div>
              <div className="flex gap-2 items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <span className="text-sm">{game.blackAccuracy?.toFixed(1)}%</span>
              </div>
            </div>
            <Link href={`/analysis/${game.id}`} passHref>
              <Button variant="outline" size="sm" className="gap-1">
                <span className="text-xs">View</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };




export default function AnalysisDashboard() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading your analysis history...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Zap className="h-8 w-8" />
        <h2 className="text-2xl font-semibold">No analyzed games yet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Analyze your chess games to track your performance and improve your
          play.
        </p>
        <Link href="/analyze">
          <Button>Analyze a Game</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Analysis History</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <AnalyzedGameCard key={game.id} game={game} />
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
    </div>
  );
}
