"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WEEKLY_GOAL_HOURS = 20; 
export function WeeklyGoalCard() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    fetch("/api/stats/weekly-total")
      .then((res) => res.json())
      .then((data) => setSeconds(data.totalSeconds ?? 0));
  }, []);

  const hours = seconds / 3600;
  const percent = Math.min(Math.round((hours / WEEKLY_GOAL_HOURS) * 100), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectif hebdomadaire</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>
            {hours.toFixed(1)}h / {WEEKLY_GOAL_HOURS}h
          </span>
          <span className="font-medium">{percent}%</span>
        </div>

        <Progress value={percent} />
      </CardContent>
    </Card>
  );
}
