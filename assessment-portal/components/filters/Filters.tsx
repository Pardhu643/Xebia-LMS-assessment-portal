"use client";

import React from "react";
import { BATCHES } from "../../data/mockData";

interface FiltersProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedBatch: string;
  onBatchChange: (batch: string) => void;
}

export default function Filters({
  selectedTime,
  onTimeChange,
  selectedBatch,
  onBatchChange
}: FiltersProps) {
  const timeOptions = ["All", "Today", "This Week", "This Month"];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border p-4 rounded-2xl shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Timeframe:</span>
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => onTimeChange(time)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTime === time
                ? "bg-primary text-white"
                : "text-foreground hover:bg-[#F7F8FC] hover:text-primary border border-border"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Batch:</span>
        <select
          value={selectedBatch}
          onChange={(e) => onBatchChange(e.target.value)}
          className="bg-white border border-border text-xs font-semibold text-foreground px-3 py-2 rounded-xl outline-none focus:border-primary transition-all cursor-pointer"
        >
          <option value="All Batches">All Batches</option>
          {BATCHES.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
