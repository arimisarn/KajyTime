import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function startOfWeek() {
  const now = new Date();
  const day = now.getDay() || 7; // dimanche = 7
  now.setDate(now.getDate() - day + 1);
  now.setHours(0, 0, 0, 0);
  return now;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = startOfWeek();

  const heartbeats = await prisma.heartbeat.findMany({
    where: {
      userId: session.user.id,
      time: { gte: start },
    },
    orderBy: { time: "asc" },
  });

  let totalSeconds = 0;

  for (let i = 1; i < heartbeats.length; i++) {
    const diff =
      (heartbeats[i].time.getTime() - heartbeats[i - 1].time.getTime()) / 1000;

    if (diff < 120) totalSeconds += diff;
  }

  return NextResponse.json({ totalSeconds });
}
