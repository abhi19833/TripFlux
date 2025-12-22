const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetPasswordEmail = async (to, resetLink, name = "User") => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "Reset Your Password",
    html: `
      <h2>Hello ${name}</h2>
      <p>You requested to reset your password.</p>
      <p>
        <a href="${resetLink}" target="_blank">
          Click here to reset your password
        </a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendResetPasswordEmail };
