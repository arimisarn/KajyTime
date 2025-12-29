import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  // providers: [
  //   GoogleProvider({
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   }),

  //   GitHubProvider({
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   }),

  //   CredentialsProvider({
  //     name: "credentials",
  //     credentials: {
  //       email: { label: "Email", type: "email" },
  //       password: { label: "Mot de passe", type: "password" },
  //     },

  //     async authorize(credentials) {
  //       if (!credentials?.email || !credentials.password) return null

  //       const user = await prisma.user.findUnique({
  //         where: { email: credentials.email },
  //       })

  //       if (!user || !user.password) return null

  //       const valid = await bcrypt.compare(
  //         credentials.password,
  //         user.password
  //       )

  //       if (!valid) return null

  //       return user
  //     },
  //   }),
  // ],
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
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

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        return valid ? user : null
      },
    }),
  ],


  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },

  pages: {
    signIn: "/login",
  },

  debug: true,
}
