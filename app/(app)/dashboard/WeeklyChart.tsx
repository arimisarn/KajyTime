"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeeklyChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats/weekly")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(([date, seconds]) => ({
          date,
          hours: Math.round(((seconds as number) / 3600) * 10) / 10,
        }));
        setData(formatted);
      });
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>7 derniers jours</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="hours" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
