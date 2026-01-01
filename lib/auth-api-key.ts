import { prisma } from "@/lib/prisma";

export async function authenticateApiKey(key: string) {
  return prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  });
}
