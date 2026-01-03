"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyEmailClient() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get("email") || ""

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    setLoading(true)

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }

      alert("Email vérifié ✅")
      router.push("/login")
    } catch {
      alert("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <p className="text-center mt-20 text-red-500">
        Email manquant dans l’URL
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold">Vérifie ton email</h1>

      <p className="text-gray-600">
        Code envoyé à : <strong>{email}</strong>
      </p>

      <input
        placeholder="Code à 6 chiffres"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Vérification..." : "Vérifier"}
      </button>
    </div>
  )
}
