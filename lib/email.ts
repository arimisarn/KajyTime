import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
    email: string,
    code: string
) {
    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: "Code de vérification KajyTime",
        html: `
      <div style="font-family:sans-serif">
        <h2>Bienvenue sur KajyTime 👋</h2>
        <p>Voici ton code de vérification :</p>
        <h1 style="letter-spacing:4px">${code}</h1>
        <p>Ce code expire dans 10 minutes.</p>
      </div>
    `,
    })
}
