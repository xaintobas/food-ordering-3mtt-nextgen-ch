import nodemailer from 'nodemailer';

// Create a transporter
const createTransporter = async () => {
  // If custom SMTP variables are set, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(`Configuring custom SMTP transporter via: ${process.env.SMTP_HOST}`);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // If we are in development and no custom SMTP is specified, try Ethereal
  try {
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.warn('Failed to create Ethereal test mail account. Falling back to console-logging transporter.');
    // Fallback: transport that logs to console
    return {
      sendMail: async (options) => {
        console.log('====== MOCK EMAIL SENT ======');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text Body: ${options.text}`);
        console.log(`HTML Body: ${options.html}`);
        console.log('==============================');
        return { messageId: 'console-mock-id-' + Date.now() };
      }
    };
  }
};

let transporter;
const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
};

export const sendEmail = async (options) => {
  const mailTransporter = await getTransporter();

  const senderName = 'Naija Bite';
  const mailOptions = {
    from: process.env.SMTP_SENDER 
      ? `"${senderName}" <${process.env.SMTP_SENDER}>` 
      : `"${senderName}" <noreply@naijabite.ng>`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await mailTransporter.sendMail(mailOptions);
  
  // Log URL for Ethereal email preview if applicable
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Email sent successfully. Preview URL: ${previewUrl}`);
  } else {
    console.log(`Email sent successfully using configured custom SMTP host.`);
  }

  return info;
};
