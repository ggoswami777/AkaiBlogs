type OtpEmailInput = {
  username: string;
  otp: string;
  expiryMinutes: number;
};

export function otpEmailTemplate({ username, otp, expiryMinutes }: OtpEmailInput) {
  return {
    subject: "Your AkaiBlogs verification code",
    text: `
Hi ${username},

Your AkaiBlogs verification code is: ${otp}

This code expires in ${expiryMinutes} minutes.

If you did not request this, you can ignore this email.
`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0505; color: #f8f6f6; padding: 32px;">
        <div style="max-width: 520px; margin: 0 auto; background: #140a0a; border: 1px solid rgba(234,42,51,0.25); border-radius: 16px; padding: 28px;">
          <p style="color: #ea2a33; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px;">
            AkaiBlogs Verification
          </p>

          <h1 style="font-size: 24px; margin: 0 0 16px; color: #ffffff;">
            Confirm your email
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            Hi <strong>${username}</strong>, use this code to complete your signup.
          </p>

          <div style="margin: 28px 0; padding: 18px; background: rgba(234,42,51,0.12); border: 1px solid rgba(234,42,51,0.35); border-radius: 12px; text-align: center;">
            <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #ffffff;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 13px; color: #94a3b8;">
            This code expires in ${expiryMinutes} minutes.
          </p>

          <p style="font-size: 12px; color: #64748b; margin-top: 28px;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `,
  };
}