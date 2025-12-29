import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email et code requis" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email déjà vérifié" },
        { status: 400 }
      )
    }

    if (
      user.verificationCode !== code ||
      !user.verificationExpires ||
      user.verificationExpires < new Date()
    ) {
      return NextResponse.json(
        { message: "Code invalide ou expiré" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    })

    return NextResponse.json({
      message: "Email vérifié avec succès",
    })
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    )
  }
}
