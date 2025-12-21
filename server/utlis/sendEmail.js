import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (resetUrl) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.DEV_EMAIL,
    subject: "Reset Password",
    html: `
      <p>Click to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });
};
