// app/api/validate-api-key/route.ts
import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth-api-key";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const key = auth.replace("Bearer ", "");
  const apiKey = await authenticateApiKey(key);

  if (!apiKey) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  return NextResponse.json({
    valid: true,
    user: {
      id: apiKey.user.id,
      email: apiKey.user.email,
      name: apiKey.user.name,
    },
  });
}
