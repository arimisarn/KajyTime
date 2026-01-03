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

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const heartbeats = await prisma.heartbeat.findMany({
    where: {
      userId: session.user.id,
      time: { gte: start, lte: end },
    },
    orderBy: { time: "asc" },
  });

  let totalSeconds = 0;

  for (let i = 1; i < heartbeats.length; i++) {
    const diff =
      (heartbeats[i].time.getTime() - heartbeats[i - 1].time.getTime()) / 1000;

    if (diff < 120) totalSeconds += diff; // max 2 min
  }

  return NextResponse.json({
    totalSeconds,
  });
}
