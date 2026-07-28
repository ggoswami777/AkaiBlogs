const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY env variable");
}

export const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || "AkaiBlogs <onboarding@resend.dev>";

type SendResendEmailInput = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

type ResendSuccessResponse = {
  id: string;
};

type ResendErrorResponse = {
  message?: string;
  name?: string;
  error?: string;
};

export async function sendResendEmail({
  from,
  to,
  subject,
  text,
  html,
}: SendResendEmailInput) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
    }),
  });

  const result = (await response.json()) as ResendSuccessResponse &
    ResendErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message || result.error || result.name || "Resend email failed",
    );
  }

  return result;
}
