import InputTabs from "@/components/InputTabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AnalyzePage() {
  return (
    <main className="flex-1 container pt-3 sm:px-6 lg:px-8">
      <div className="flex items-center mb-1">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="text-center text-2xl font-bold tracking-tight">
          Analyze Chess Game
        </div>
      </div>
      <InputTabs />
    </main>
  );
}
