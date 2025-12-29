"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const text = await res.text() // <-- ne pas parser JSON tout de suite
      console.log("Response text:", text)

      let data
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error("Erreur JSON.parse:", err)
        alert("Le serveur n'a pas renvoyé un JSON valide")
        setLoading(false)
        return
      }

      if (!res.ok) {
        alert(data.message || "Erreur lors de l'inscription")
        setLoading(false)
        return
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      })
    } catch (err: any) {
      alert(err.message || "Erreur réseau")
      setLoading(false)
    }
  }


  return (
    <div>
      <h1>Créer un compte</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Inscription..." : "S’inscrire"}
      </button>
    </div>
  )
}
