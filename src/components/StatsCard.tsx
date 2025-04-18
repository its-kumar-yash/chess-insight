import React from "react";
import { Card, CardContent } from "./ui/card";

export default function StatsCard({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 !py-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
