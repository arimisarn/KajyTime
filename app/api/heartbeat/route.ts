import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/auth-api-key";

export async function POST(req: Request) {
  const apiKey = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
  }

  const auth = await authenticateApiKey(apiKey);
  if (!auth) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
  }

  const body = await req.json();

  await prisma.heartbeat.create({
    data: {
      userId: auth.userId,
      file: body.file,
      language: body.language,
      project: body.project,
      time: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
