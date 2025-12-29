import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { message: "Email déjà utilisé" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })

    // ⚡ Sérialisation manuelle pour éviter JSON.parse error
    const safeUser = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }

    return NextResponse.json({ message: "Utilisateur créé", user: safeUser })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
