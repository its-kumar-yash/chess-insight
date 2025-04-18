"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Award,
  BarChart3,
  Calendar,
  PuzzleIcon as ChessPiece,
  ChevronDown,
} from "lucide-react";
import { fetchUserStats } from "@/actions/game.action";
import StatsCard from "./StatsCard";
import { Skeleton } from "./ui/skeleton";

export default function StatsCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<null | any>(null);

  useEffect(() => {
    const getStats = async () => {
      const res = await fetchUserStats();
      if (res?.success) {
        setStats(res.stats);
      }
      setLoading(false);
    };
    getStats();
  }, []);

  const skeletonCard = (
    <Card className="bg-muted/30 border-primary/20 !py-0 h-40">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-12 rounded-full !bg-secondary" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 !bg-secondary" />
          <Skeleton className="h-6 w-16 !bg-secondary" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <React.Fragment key={i}>{skeletonCard}</React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Games Analyzed"
        icon={<ChessPiece className="h-6 w-6 text-primary" />}
        value={stats?.totalGames}
      />
      <StatsCard
        title="Average Accuracy"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        value={`${stats?.avgAccuracy?.toFixed(1)}%`}
      />
      <StatsCard
        title="Brilliant Moves"
        icon={<Award className="h-6 w-6 text-primary" />}
        value={stats?.brilliantMoves}
      />
      <StatsCard
        title="Blunders"
        icon={<Calendar className="h-6 w-6 text-primary" />}
        value={
          stats?.recentMistakes?.white.blunders +
          stats?.recentMistakes?.black.blunders
        }
      />
    </div>
  );
}
