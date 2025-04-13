"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PuzzleIcon as ChessPiece } from "lucide-react";
import { useChessInsightStore } from "@/store/chessInsight";
import { fetchUserGames, parsePGN } from "@/lib/chessUtils";
import { ChessGameResponse } from "@/lib/types";
import GameSelectionModal from "./GameSelectionModal";
import { useRouter } from "next/navigation";
import { randomUUID } from "crypto";

export default function InputTabs() {
  const router = useRouter();

  const {
    inputPGN,
    setInputPGN,
    chessGamePGN,
    setChessGamePGN,
    inputUsername,
    setInputUsername,
    gameListByUsername,
    setGameListByUsername,
    headerPGN,
    setHeaderPGN,
  } = useChessInsightStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("pgn");
  const [showGameModal, setShowGameModal] = useState(false);

  const handleTabSelect = (value: string) => {
    setActiveTab(value);
    setInputUsername("");
    setInputPGN("");
  };

  const handleUsernameSubmit = async () => {
    if (!inputUsername.trim()) return;

    console.log(
      `Fetching games for ${inputUsername} from ${
        activeTab === "chess-com" ? "Chess.com" : "Lichess"
      }`
    );
    setIsAnalyzing(true);

    try {
      const platform = activeTab === "chess-com" ? "Chess.com" : "Lichess";
      const fetchedGames = await fetchUserGames(inputUsername, platform);
      setGameListByUsername(fetchedGames);
      console.log("Fetched games:", fetchedGames);
      setShowGameModal(true);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (activeTab == "pgn") {
      if (!inputPGN.trim()) return;
      setIsAnalyzing(true);

      try {
        const chessGame = parsePGN(inputPGN);
        setChessGamePGN(chessGame);
        setHeaderPGN(chessGame?.header() || {});

        if (!chessGame) {
          console.log("Invalid PGN format");
          setIsAnalyzing(false);
          return;
        }

        const analysisId = generateUniqueId();

        console.log("Analyzing game with ID:", analysisId);

        router.push(`/analysis/${analysisId}`);
      } catch (error) {
        console.error("Error parsing PGN:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const generateUniqueId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleGameSelect = (game: ChessGameResponse) => {
    const chessGame = parsePGN(game.pgn);
    setChessGamePGN(chessGame);
    setHeaderPGN(chessGame?.header() || {});
    setShowGameModal(false);

    const analysisId = generateUniqueId();

    console.log("Analyzing game with ID:", analysisId);

    router.push(`/analysis/${analysisId}`);
  };

  return (
    <Tabs
      defaultValue="pgn"
      value={activeTab}
      onValueChange={handleTabSelect}
      className="w-full"
    >
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 ml-auto mb-8">
        <TabsTrigger value="pgn" className="">
          PGN Input
        </TabsTrigger>
        <TabsTrigger value="chess-com">Chess.com</TabsTrigger>
        <TabsTrigger value="lichess">Lichess.org</TabsTrigger>
      </TabsList>

      <TabsContent value="pgn">
        <Card className="border-primary/20 px-6 bg-background mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Enter PGN</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Paste the PGN notation of your chess game
            </CardDescription>
          </CardHeader>
          <CardContent className="!p-0">
            <Textarea
              placeholder="Paste your PGN here..."
              className="min-h-[200px] resize-none focus:outline-none font-mono text-sm !bg-background !border-primary/30"
              value={inputPGN}
              onChange={(e) => setInputPGN(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputPGN.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ChessPiece className="mr-2 h-4 w-4" />
                    Analyze Game
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chess-com">
        <Card className="border-primary/20 px-6 max-w-2xl mx-auto bg-background">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Import from Chess.com
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Enter your Chess.com username to import games
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 !p-0">
            <div className="flex gap-2">
              <Input
                placeholder="Chess.com username"
                className="!bg-background !border-primary/30"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
              />
              <Button
                onClick={handleUsernameSubmit}
                disabled={isAnalyzing || !inputUsername.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Loading...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="lichess">
        <Card className="border-primary/20 px-6 max-w-2xl mx-auto bg-background">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Import from Lichess.org
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Enter your Lichess.org username to import games
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 !p-0">
            <div className="flex gap-2">
              <Input
                placeholder="Lichess.org username"
                className="!bg-background !border-primary/30"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
              />
              <Button
                onClick={handleUsernameSubmit}
                disabled={isAnalyzing || !inputUsername.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Loading...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {showGameModal && (
        <GameSelectionModal
          isOpen={showGameModal}
          games={gameListByUsername}
          onSelect={handleGameSelect}
          onClose={() => setShowGameModal(false)}
        />
      )}
    </Tabs>
  );
}
