import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const heartbeats = await prisma.heartbeat.findMany({
    where: {
      userId: session.user.id,
      time: { gte: start },
    },
    orderBy: { time: "asc" },
  });

  const stats: Record<string, number> = {};

  for (let i = 1; i < heartbeats.length; i++) {
    const prev = heartbeats[i - 1];
    const curr = heartbeats[i];

    const diff = (curr.time.getTime() - prev.time.getTime()) / 1000;

    if (diff > 120) continue;

    const project = curr.project || "Other";
    stats[project] = (stats[project] || 0) + diff;
  }

  return NextResponse.json(stats);
}
