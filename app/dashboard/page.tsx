"use client"

import { signOut, useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Chargement...</p>
  }

  if (!session?.user) {
    return <p>Utilisateur non connecté</p>
  }

  const { name, email, image } = session.user

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard</h1>

      {image && (
        <img
          src={image}
          alt={name || "Profil"}
          className="w-24 h-24 rounded-full border"
        />
      )}

      <p className="text-lg font-semibold">{name}</p>
      <p className="text-gray-600">{email}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Déconnexion
      </button>
    </div>
  )
}
