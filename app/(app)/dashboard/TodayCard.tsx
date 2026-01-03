"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}min`;
}

export function TodayCard() {
  const [today, setToday] = useState(0);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    fetch("/api/stats/compare")
      .then((res) => res.json())
      .then((data) => {
        setToday(data.todaySeconds ?? 0);
        setDiff(data.diffPercent ?? 0);
      });
  }, []);

  const isUp = diff >= 0;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Aujourd’hui</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{formatTime(today)}</div>

        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isUp ? "text-green-600" : "text-red-500"
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {Math.abs(diff)}% vs hier
        </div>
      </CardContent>
    </Card>
  );
}
