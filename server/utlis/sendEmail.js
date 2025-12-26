const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPasswordEmail = async (to, resetLink, name) => {
  if (!to) {
    throw new Error("Recipient email missing");
  }

  const msg = {
    to: String(to).trim(),
    from: String(process.env.EMAIL_FROM).trim(),
    subject: "Reset Your Password",
    text: `Reset your password using this link: ${resetLink}`,
    html: `
      <h2>Hello ${name ? name : "User"}</h2>
      <p>You requested to reset your password.</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendResetPasswordEmail };
