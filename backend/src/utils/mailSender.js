import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // ✅ fixed here
      },
    });

    const info = await transporter.sendMail({
      from: `"ApnaMeet 👨‍💻" <${process.env.MAIL_USER}>`, // ✅ safer
      to: email,
      subject: title,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #ccc;">
          <h2 style="color: #7f53ac;">ApnaMeet Password Reset</h2>
          <p>Hello,</p>
          <p>${body}</p>
          <br/>
          <p style="font-size: 0.9rem; color: #555;">
            If you did not request this, please ignore this email.
          </p>
          <hr style="margin: 20px 0;" />
          <p style="text-align: center; font-size: 0.85rem; color: #999;">
            © ${new Date().getFullYear()} ApnaMeet | All rights reserved
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail send error:", error);
    throw error;
  }
};

export default mailSender;
