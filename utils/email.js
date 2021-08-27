
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user) {
    console.log('test');
    this.to = 'erraco.wow@gmail.com';
    this.firstName = 'test'
    this.from = `Studio73pty <test_web@studio73pty.com>`;
    console.log('test2');
  }

  newTransport() {
    console.log('test!');
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'studio73pty.noreply@gmail.com',
          pass: 'pfiakggdypqridiq'
      },
      tls:{
          rejectUnauthorized: false
      },
    });
  }
  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      subject,
    });
  console.log('aqui');
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      // to: this.to,
      to: 'jdiaz.97ma@gmail.com',

      subject,
      html,
      text: htmlToText.fromString(html),
    };
  console.log('aqui');
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    console.log('a');
  const resultmail = await this.send('welcome', 'Nuevo Brief de cliente!');
  console.log(resultmail);
  }

};
