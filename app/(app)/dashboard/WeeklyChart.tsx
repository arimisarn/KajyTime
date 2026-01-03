"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const WEEK_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function getDayName(date: string) {
  const d = new Date(date).getDay();
  return WEEK_DAYS[d === 0 ? 6 : d - 1];
}

type DayStat = {
  day: string;
  hours: number;
};

const chartConfig = {
  hours: {
    label: "Heures",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function WeeklyChart() {
  const [data, setData] = useState<DayStat[]>([]);

  useEffect(() => {
    fetch("/api/stats/weekly")
      .then((res) => res.json())
      .then((stats) => {
        const base: Record<string, number> = {};
        WEEK_DAYS.forEach((d) => (base[d] = 0));

        Object.entries(stats).forEach(([date, seconds]) => {
          const day = getDayName(date);
          base[day] = Math.round(((seconds as number) / 3600) * 10) / 10;
        });

        setData(
          WEEK_DAYS.map((day) => ({
            day,
            hours: base[day],
          }))
        );
      });
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progression hebdomadaire</CardTitle>
        <CardDescription className="text-xs">Lundi → Dimanche</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(v) => v.slice(0, 3)}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="hours"
              type="natural"
              stroke="var(--color-hours)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
