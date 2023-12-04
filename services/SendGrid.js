const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

class SendGrid {
  sgMail = sgMail;

  constructor() {
    this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to, subject, template, dynamicTemplateData) {
    const templateContent = await ejs.renderFile(
      path.join(__dirname, `../email/templates/${template}.ejs`),
      dynamicTemplateData
    );
    const msg = {
      to,
      from: process.env.SENDGRID_EMAIL,
      subject,
      html: templateContent,
    };
    await this.sgMail.send(msg);
  }
}

module.exports = new SendGrid();
