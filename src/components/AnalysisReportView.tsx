import React from "react";
import ChessBoard from "./ChessBoard";
import NewControlPanel from "./NewControlPanel";

export default function AnalysisReportView() {
  return (
    <div className="flex gap-6">
      <ChessBoard />
      <NewControlPanel />
    </div>
  );
}
