import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

export default function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden border-primary/20 !bg-background !px-6 !py-0 mb-6">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-1/4 bg-muted/30 flex flex-col justify-center">
            <Skeleton className="h-6 w-14 mb-2 !bg-secondary" />
            <Skeleton className="h-4 w-32 mb-2 !bg-secondary" />
            <Skeleton className="h-3 w-24 mb-2 !bg-secondary" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="w-3 h-3 rounded-full !bg-secondary" />
              <Skeleton className="h-4 w-28 !bg-secondary" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="w-3 h-3 rounded-full !bg-secondary" />
              <Skeleton className="h-4 w-28 !bg-secondary" />
            </div>
          </div>
          <div className="p-4 md:w-3/4">
            <div className="mb-4">
              <Skeleton className="h-4 w-16 mb-1 !bg-secondary" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-8 !bg-secondary" />
                    <Skeleton className="h-3 w-8 !bg-secondary" />
                  </div>
                  <Skeleton className="h-1 w-full !bg-secondary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-8 !bg-secondary" />
                    <Skeleton className="h-3 w-8 !bg-secondary" />
                  </div>
                  <Skeleton className="h-1 w-full !bg-secondary" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-8 w-24 !bg-secondary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
