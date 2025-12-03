import nodemailer from "nodemailer";

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  console.error("MISSING EMAIL CONFIGURATION:");
  console.error("- EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
  console.error("- EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD ? "✓ Set" : "✗ Missing");
  console.error("\nPlease add these to your .env.local file:");
  console.error("EMAIL_USER=your-email@gmail.com");
  console.error("EMAIL_APP_PASSWORD=your-16-char-app-password");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendMagicLink(email, token, baseUrl) {
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;
  console.log("Magic link URL:", magicLink);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your MongoDB Minute Sign-In Link",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #00684A;
              margin: 0;
              font-size: 28px;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #00684A 0%, #004D37 100%);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: linear-gradient(135deg, #00ED64 0%, #00684A 100%);
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .alt-link {
              margin-top: 20px;
              padding: 15px;
              background: #f5f5f5;
              border-radius: 4px;
              word-break: break-all;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🎬 MongoDB Minute</h1>
            </div>

            <h2>Sign in to your account</h2>

            <p>Click the button below to sign in to MongoDB Minute. This link will expire in 15 minutes.</p>

            <div style="text-align: center;">
              <a href="${magicLink}" class="button">Sign In to MongoDB Minute</a>
            </div>

            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>

            <div class="alt-link">
              ${magicLink}
            </div>

            <div class="footer">
              <p>This link will expire in 15 minutes for security reasons.</p>
              <p>If you didn't request this link, you can safely ignore this email.</p>
              <p style="margin-top: 20px;">
                <strong>MongoDB Minute</strong><br>
                60-second MongoDB tips for developers
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Sign in to MongoDB Minute

Click the link below to sign in to your account. This link will expire in 15 minutes.

${magicLink}

If you didn't request this link, you can safely ignore this email.

MongoDB Minute - 60-second MongoDB tips for developers
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
