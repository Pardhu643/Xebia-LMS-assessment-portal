"use client";

import React from "react";
import { BookOpen, Users, FileText, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CardData {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface StatCardsProps {
  cards: CardData[];
}

export default function StatCards({ cards }: StatCardsProps) {
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "total classes":
      case "my classes":
        return <BookOpen className="text-primary" size={24} />;
      case "total students":
      case "pending assessments":
        return <Users className="text-accent" size={24} />;
      case "active assessments":
      case "submitted assessments":
        return <FileText className="text-cta" size={24} />;
      default:
        return <CheckCircle2 className="text-[#84117C]" size={24} />;
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <TrendingUp size={16} className="text-emerald-500" />;
    if (trend === "down") return <TrendingDown size={16} className="text-rose-500" />;
    return <Minus size={16} className="text-amber-500" />;
  };

  const getBgClass = (title: string) => {
    switch (title.toLowerCase()) {
      case "total classes":
      case "my classes":
        return "bg-primary/5 border-primary/10";
      case "total students":
      case "pending assessments":
        return "bg-accent/5 border-accent/10";
      case "active assessments":
      case "submitted assessments":
        return "bg-cta/5 border-cta/10";
      default:
        return "bg-[#84117C]/5 border-[#84117C]/10";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-border rounded-2xl p-6 shadow-xs flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              {card.title}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">{card.value}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-text-muted">
              {getTrendIcon(card.trend)}
              <span>{card.change}</span>
            </div>
          </div>

          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getBgClass(card.title)}`}>
            {getIcon(card.title)}
          </div>
        </div>
      ))}
    </div>
  );
}
