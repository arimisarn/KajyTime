"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ================================
   Utils
================================ */

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

function dayLabel(dateStr: string) {
  return DAYS[new Date(dateStr).getDay()];
}

/* ================================
   Types
================================ */

type WeeklyData = {
  day: string;
  hours: number;
};

/* ================================
   Chart config (shadcn)
================================ */

const chartConfig = {
  hours: {
    label: "Heures",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/* ================================
   Component
================================ */

export function WeeklyChart() {
  const [data, setData] = useState<WeeklyData[]>([]);
  const totalHours = data.reduce((a, b) => a + b.hours, 0);

  useEffect(() => {
    fetch("/api/stats/weekly")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(([date, seconds]) => ({
          day: dayLabel(date),
          hours: Math.round(((seconds as number) / 3600) * 10) / 10,
        }));
        setData(formatted);
      });
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>7 derniers jours</CardTitle>
        <CardDescription>Temps de code quotidien</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 3)}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}h`}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="hours"
              type="natural"
              stroke="var(--color-hours)"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "var(--color-hours)",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total cette semaine : {totalHours.toFixed(1)}h{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Basé sur l’activité enregistrée par KajyTime
        </div>
      </CardFooter>
    </Card>
  );
}
