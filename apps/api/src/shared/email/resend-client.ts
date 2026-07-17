import { Resend } from "resend";
import { env } from "../../config/env";

let client: Resend | null = null;

function getClient() {
  if (!env.resendApiKey) return null;
  if (!client) client = new Resend(env.resendApiKey);
  return client;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = getClient();

  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY nao configurado; e-mail de recuperacao de senha nao enviado para ${to}. Link: ${resetUrl}`,
    );
    return;
  }

  await resend.emails.send({
    from: env.resendFromEmail,
    to,
    subject: "Redefinir senha",
    html: `<p>Recebemos um pedido para redefinir sua senha.</p><p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>. O link expira em 1 hora.</p><p>Se voce nao pediu isso, ignore este e-mail.</p>`,
  });
}
