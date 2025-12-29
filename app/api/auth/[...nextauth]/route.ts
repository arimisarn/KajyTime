import NextAuth, { type AuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Connexion avec email + mot de passe
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return user
      },
    }),

    // Connexion via GitHub
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "database" },

  pages: { signIn: "/login" },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },

  debug: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

