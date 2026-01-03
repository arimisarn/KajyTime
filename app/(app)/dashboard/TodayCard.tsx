"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}min`;
}

export function TodayCard() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    fetch("/api/stats/today")
      .then((res) => res.json())
      .then((data) => setSeconds(data.totalSeconds ?? 0));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aujourd’hui</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {formatTime(seconds)}
      </CardContent>
    </Card>
  );
}
