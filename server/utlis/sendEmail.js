const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPasswordEmail = async (to, resetLink, name = "User") => {
  // HARD validation (important)
  if (!to || !resetLink) {
    throw new Error("Invalid email payload");
  }

  const msg = {
    to: to.trim(),
    from: process.env.FROM_EMAIL.trim(),
    subject: "Reset Your Password",

    // ✅ ADD TEXT (THIS IS CRITICAL)
    text: `Hello ${name}, reset your password using this link: ${resetLink}`,

    // HTML is fine, but NOT alone
    html: `
      <h2>Hello ${name}</h2>
      <p>You requested to reset your password.</p>
      <p>
        <a href="${resetLink}">Reset Password</a>
      </p>
      <p>This link expires in 15 minutes.</p>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendResetPasswordEmail };
