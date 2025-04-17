import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  Award,
  BarChart3,
  Calendar,
  PuzzleIcon as ChessPiece,
  ChevronDown,
} from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 !py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ChessPiece className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Total Games Analyzed
            </p>
            <p className="text-3xl font-bold">128</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 !py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Average Accuracy</p>
            <p className="text-3xl font-bold">92.8%</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 !py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Brilliant Moves</p>
            <p className="text-3xl font-bold">24</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 !py-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Mistakes</p>
            <p className="text-3xl font-bold">42</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
