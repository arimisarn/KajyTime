// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/lib/email"


function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const code = generateCode()

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0],
        verificationCode: code,
        verificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    })

    // TODO : envoyer l'email ici
    console.log("Code de vérification :", code)

    return NextResponse.json({
      message: "Compte créé. Vérifie ton email.",
      redirectTo: `/verify-email?email=${email}`,

    })
    
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
