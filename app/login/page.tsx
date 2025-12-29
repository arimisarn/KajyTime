"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin() {
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard",
        })
    }

    return (
        <div>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Se connecter</button>

            <hr />

            <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                Continuer avec GitHub
            </button>
        </div>
    )
}
