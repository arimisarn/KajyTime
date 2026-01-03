"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7", // purple
];

export function LanguageChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats/languages")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(
          ([language, seconds]) => ({
            name: language,
            value: Math.round((seconds as number) / 60), // minutes
          })
        );
        setData(formatted);
      });
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Langages aujourd’hui</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
