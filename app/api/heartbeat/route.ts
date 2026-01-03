import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/auth-api-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, file, language, timestamp } = body;

    if (!apiKey || !file || !language || !timestamp) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKeyRecord = await authenticateApiKey(apiKey);
    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    await prisma.heartbeat.create({
      data: {
        userId: apiKeyRecord.userId,
        file,
        language,
        time: new Date(timestamp * 1000),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Heartbeat error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
