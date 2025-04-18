import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { Button } from "./ui/button";
import { useChessInsightStore } from "@/store/chessInsight";
import { parsePGN } from "@/lib/chessUtils";
import { useRouter } from "next/navigation";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function GameCard({ game }: any) {
  const router = useRouter();

  const { setChessGamePGN, setHeaderPGN, setCurrentSelectedGame } =
    useChessInsightStore();

  const handleViewAnalysis = () => {
    const chessGame = parsePGN(game.pgn);
    setChessGamePGN(chessGame);
    setHeaderPGN(chessGame?.header() || {});
    setCurrentSelectedGame(game);

    router.push(`/analysis/${game.id}`);
  };

  const getBadgeVariant = (result: string) => {
    if (result === "1-0") return "default";
    if (result === "0-1") return "destructive";
    return "outline";
  };

  return (
    <Card className="overflow-hidden border-primary/20 !py-0">
      <CardContent className="p-0 !bg-background">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-1/4 bg-secondary/30 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant={getBadgeVariant(game.result)}
                className="!border-primary"
              >
                {game.winner === "white"
                  ? "1-0"
                  : game.winner === "black"
                  ? "0-1"
                  : "1/2-1/2"}
              </Badge>
            </div>
            <p className="text-sm font-medium">
              {game.opening || game.timeClass}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {formatDate(game.createdAt)} • {game.source || "Analysis"}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
              <p className="text-sm">{game.whiteUsername}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <p className="text-sm">{game.blackUsername}</p>
            </div>
          </div>
          <div className="p-4 md:w-3/4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Accuracy</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">White</span>
                    <span className="text-xs font-medium">
                      {game.whiteAccuracy?.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={game.whiteAccuracy} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Black</span>
                    <span className="text-xs font-medium">
                      {game.blackAccuracy?.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={game.blackAccuracy} className="h-1" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleViewAnalysis}>
                View Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
