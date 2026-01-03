"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LanguageChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats/languages")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(([language, seconds]) => ({
          language,
          minutes: Math.round((seconds as number) / 60),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Langages aujourd’hui</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="language" />
            <Tooltip />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
