var mailgun = require("mailgun-js");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

class EmailService {
  #mg;
  #nodemailer;

  constructor() {
    this.#mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });

    this.#nodemailer = nodemailer.createTransport({
      secure: false,
      auth: {
        user: "support@quartzclassic.com",
        pass: "Initial@01",
      },
      host: "smtp-mail.outlook.com",
      port: "587",
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });
  }

  async send({ from, to, subject, template, payload }) {
    await this.#mg.messages().send({ from, to, subject, template, ...payload });
    console.log(`email sent to ${to}`);
  }

  async sendNodemailer(to, subject, opts) {
    await this.#nodemailer.sendMail({
      from: "support@quartzclassic.com",
      to,
      subject,
      html: await this.__loadTemplate(`./email/templates/plain`, opts),
    });
    console.log("email sent to " + to);
  }

  async __loadTemplate(templatePath, data) {
    const template = await fs.readFileSync(`${templatePath}.ejs`, "utf8");
    return ejs.render(template, data);
  }
}

module.exports = Object.freeze(new EmailService());
