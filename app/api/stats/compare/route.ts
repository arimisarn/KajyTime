import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function getDayRange(offset = 0) {
  const start = new Date();
  start.setDate(start.getDate() - offset);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - offset);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function computeSeconds(heartbeats: any[]) {
  let total = 0;

  for (let i = 1; i < heartbeats.length; i++) {
    const diff =
      (heartbeats[i].time.getTime() - heartbeats[i - 1].time.getTime()) / 1000;

    if (diff < 120) total += diff;
  }

  return total;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayRange = getDayRange(0);
  const yesterdayRange = getDayRange(1);

  const [todayHB, yesterdayHB] = await Promise.all([
    prisma.heartbeat.findMany({
      where: {
        userId: session.user.id,
        time: { gte: todayRange.start, lte: todayRange.end },
      },
      orderBy: { time: "asc" },
    }),
    prisma.heartbeat.findMany({
      where: {
        userId: session.user.id,
        time: { gte: yesterdayRange.start, lte: yesterdayRange.end },
      },
      orderBy: { time: "asc" },
    }),
  ]);

  const todaySeconds = computeSeconds(todayHB);
  const yesterdaySeconds = computeSeconds(yesterdayHB);

  const diffPercent =
    yesterdaySeconds === 0
      ? 100
      : Math.round(
          ((todaySeconds - yesterdaySeconds) / yesterdaySeconds) * 100
        );

  return NextResponse.json({
    todaySeconds,
    yesterdaySeconds,
    diffPercent,
  });
}
