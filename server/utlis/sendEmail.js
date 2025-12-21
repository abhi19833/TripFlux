const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (resetUrl) => {
  console.log("SENDING EMAIL TO:", process.env.DEV_EMAIL);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.DEV_EMAIL,
    subject: "Reset Password",
    html: `
      <p>Click to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });

  console.log("EMAIL SENT");
};

module.exports = sendEmail;
