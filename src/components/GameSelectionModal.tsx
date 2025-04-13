import { ChessGameResponse } from "@/lib/types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface GameSelectionModalProps {
  isOpen: boolean;
  games: ChessGameResponse[];
  onSelect: (game: ChessGameResponse) => void;
  onClose: () => void;
}

export default function GameSelectionModal({
  isOpen,
  games,
  onSelect,
  onClose,
}: GameSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] !max-w-4xl overflow-y-auto !border-primary/20">
        <DialogHeader>
          <DialogTitle>Select a Game</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {games.slice().reverse().map((game) => (
            <div
              key={game.uuid}
              className="p-4 border rounded-lg hover:bg-muted transition-colors !border-primary/20"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {game.white.username} ({game.white.rating}) vs{" "}
                  {game.black.username} ({game.black.rating})
                </h3>
                <span className="text-sm text-muted-foreground">
                  {game.platform === "lichess" ? "Lichess" : "Chess.com"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground capitalize">
                    {game.timeClass}
                  </span>
                  {game.url && (
                    <p>
                      <a
                        href={game.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        View on{" "}
                        {game.platform === "lichess" ? "Lichess" : "Chess.com"}
                      </a>
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => onSelect(game)}
                >
                  Analyze This Game
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
