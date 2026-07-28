const brevoApiKey = process.env.BREVO_API_KEY ?? "";

if (!brevoApiKey) {
  throw new Error("Missing BREVO_API_KEY env variable");
}

export const emailFrom =
  process.env.EMAIL_FROM_NAME || "AkaiBlogs";

type SendBrevoEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendBrevoEmail({
  to,
  subject,
  text,
  html,
}: SendBrevoEmailInput) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: emailFrom, email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      (result as any).message || (result as any).error || "Brevo email failed"
    );
  }

  return result;
}
