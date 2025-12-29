import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import md5 from "md5" // pour générer le hash Gravatar

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
      return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 👉 Extraire le nom avant @ et mettre la première lettre en majuscule
    let rawName = email.split("@")[0].split(".")[0]
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1)

    // 👉 Générer l'URL Gravatar pour l'email
    const emailHash = md5(email.trim().toLowerCase())
    const image = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, image },
    })

    return NextResponse.json({ message: "Utilisateur créé", user })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
