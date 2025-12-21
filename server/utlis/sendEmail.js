const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  await resend.emails.send({
    from: "TripFlux <abhishekk12733@gmail.com>",
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
