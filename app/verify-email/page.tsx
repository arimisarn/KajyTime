import { Suspense } from "react"
import VerifyEmailClient from "./verify-email-client"

export const dynamic = "force-dynamic"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="mt-20 text-center">Chargement…</p>}>
      <VerifyEmailClient />
    </Suspense>
  )
}
