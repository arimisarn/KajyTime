"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

type PieData = {
  name: string; // langage
  value: number; // minutes
};

export function LanguageChart() {
  const [data, setData] = useState<PieData[]>([]);

  useEffect(() => {
    fetch("/api/stats/languages")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(([language, seconds]) => ({
          name: language,
          value: Math.round((seconds as number) / 60),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Langages aujourd’hui</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
