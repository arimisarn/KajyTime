"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats/projects")
      .then((res) => res.json())
      .then((stats) => {
        const formatted = Object.entries(stats).map(([project, seconds]) => ({
          project,
          minutes: Math.round((seconds as number) / 60),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets aujourd’hui</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis dataKey="project" />
            <Tooltip />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
