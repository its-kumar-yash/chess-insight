import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { PuzzleIcon as ChessPiece } from "lucide-react";
import StatsCards from "@/components/StatsCards";
import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function DashboardPage() {
  return (
    <main className="flex-1 container pt-3 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your chess progress and analyze your games
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/analyze">
            <Button>
              <ChessPiece className="mr-2 h-4 w-4" />
              Analyze New Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />
      <AnalysisDashboard />

    </main>
  );
}
