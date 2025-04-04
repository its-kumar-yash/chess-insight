import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface PlayerCardProps {
  playerName: string;
  playerRating: string;
  playerImage?: string;
  cardPosition: string;
}

export default function PlayerCard({
  playerName,
  playerRating,
  playerImage,
  cardPosition,
}: PlayerCardProps) {
  return (
    <Card
      className={`!py-2.5 rounded-none ${
        cardPosition === "top" ? "rounded-t-lg" : "rounded-b-lg"
      }`}
    >
      <CardHeader className="flex px-4 items-center gap-2">
        <Avatar className="">
          <AvatarImage src={ playerImage !== "" ? playerImage : "avatar.png"} />
        </Avatar>
        <CardTitle>
          <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {playerName} ({playerRating})
          </span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
