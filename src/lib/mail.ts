import nodemailer from "nodemailer";

const sendMail = async (to: string, subject: string, html: string) => {
  const mailSmtpHost = process.env.SMTP_HOST;
  if (mailSmtpHost === undefined) {
    throw new Error("SMTP_HOST is not defined");
  }

  const mailSmtpPort = process.env.SMTP_PORT;
  if (mailSmtpPort === undefined) {
    throw new Error("SMTP_PORT is not defined");
  }

  const mailSmtpUser = process.env.SMTP_USER;
  if (mailSmtpUser === undefined) {
    throw new Error("SMTP_USER is not defined");
  }

  const mailSmtpPass = process.env.SMTP_PASS;
  if (mailSmtpPass === undefined) {
    throw new Error("SMTP_PASS is not defined");
  }

  const mailSmtpFrom = process.env.SMTP_FROM;
  if (mailSmtpFrom === undefined) {
    throw new Error("SMTP_FROM is not defined");
  }

  const transporter = nodemailer.createTransport({
    host: mailSmtpHost,
    secure: false,
    port: parseInt(mailSmtpPort),
    auth: {
      user: mailSmtpUser,
      pass: mailSmtpPass
    }
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: mailSmtpFrom,
    to,
    subject: `Wroom — ${subject}`,
    html
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

export default sendMail;
