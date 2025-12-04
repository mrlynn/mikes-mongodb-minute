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

/**
 * Send notification when episode is submitted for review
 */
export async function sendReviewRequestNotification(episode, submitter, reviewers, baseUrl) {
  const episodeUrl = `${baseUrl}/admin/episodes/${episode._id}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reviewers.join(", "),
    subject: `[MongoDB Minute] Episode Ready for Review: ${episode.title}`,
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
            .badge {
              display: inline-block;
              padding: 4px 12px;
              background: #0077B5;
              color: white;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .episode-info {
              background: #F7FAFC;
              border-left: 4px solid #0077B5;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .episode-info h3 {
              margin: 0 0 10px 0;
              color: #001E2B;
            }
            .episode-info p {
              margin: 5px 0;
              color: #5F6C76;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #0077B5 0%, #005A8C 100%);
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🎬 MongoDB Minute</h1>
            </div>

            <span class="badge">REVIEW REQUESTED</span>

            <h2>New Episode Ready for Technical Review</h2>

            <p>${submitter.name} has submitted an episode for technical review.</p>

            <div class="episode-info">
              <h3>${episode.title}</h3>
              <p><strong>Episode #${episode.episodeNumber || "TBD"}</strong></p>
              <p><strong>Category:</strong> ${episode.category}</p>
              <p><strong>Difficulty:</strong> ${episode.difficulty}</p>
              ${episode.hook ? `<p style="margin-top: 15px;"><em>${episode.hook}</em></p>` : ""}
            </div>

            <p>Please review the episode for technical accuracy and provide feedback.</p>

            <div style="text-align: center;">
              <a href="${episodeUrl}" class="button">Review Episode</a>
            </div>

            <div class="footer">
              <p><strong>MongoDB Minute</strong><br>
              60-second MongoDB tips for developers</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Episode Ready for Technical Review

${submitter.name} has submitted an episode for technical review.

Episode: ${episode.title}
Episode #${episode.episodeNumber || "TBD"}
Category: ${episode.category}
Difficulty: ${episode.difficulty}

Review the episode: ${episodeUrl}

MongoDB Minute - 60-second MongoDB tips for developers
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending review request notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification when episode review is completed
 */
export async function sendReviewCompletedNotification(episode, reviewer, submitter, decision, notes, baseUrl) {
  const episodeUrl = `${baseUrl}/admin/episodes/${episode._id}`;
  const isApproved = decision === "approved";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: submitter.email,
    subject: `[MongoDB Minute] Episode Review ${isApproved ? "Approved" : "Requires Changes"}: ${episode.title}`,
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
            .badge {
              display: inline-block;
              padding: 4px 12px;
              background: ${isApproved ? "#00684A" : "#E63946"};
              color: white;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .episode-info {
              background: #F7FAFC;
              border-left: 4px solid ${isApproved ? "#00684A" : "#E63946"};
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .episode-info h3 {
              margin: 0 0 10px 0;
              color: #001E2B;
            }
            .episode-info p {
              margin: 5px 0;
              color: #5F6C76;
            }
            .notes-box {
              background: #FFF9E6;
              border: 1px solid #FFE5A3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
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
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🎬 MongoDB Minute</h1>
            </div>

            <span class="badge">${isApproved ? "REVIEW APPROVED" : "CHANGES REQUESTED"}</span>

            <h2>Episode Review ${isApproved ? "Approved" : "Completed"}</h2>

            <p>${reviewer.name} has reviewed your episode.</p>

            <div class="episode-info">
              <h3>${episode.title}</h3>
              <p><strong>Episode #${episode.episodeNumber || "TBD"}</strong></p>
              <p><strong>Category:</strong> ${episode.category}</p>
              <p><strong>Difficulty:</strong> ${episode.difficulty}</p>
            </div>

            ${notes ? `
            <div class="notes-box">
              <strong>Reviewer Notes:</strong>
              <p style="margin: 10px 0 0 0;">${notes}</p>
            </div>
            ` : ""}

            ${isApproved
              ? "<p><strong>✅ Next Step:</strong> Your episode has passed technical review and is ready for final approval!</p>"
              : "<p><strong>📝 Next Step:</strong> Please review the feedback and make the requested changes, then resubmit for review.</p>"
            }

            <div style="text-align: center;">
              <a href="${episodeUrl}" class="button">View Episode</a>
            </div>

            <div class="footer">
              <p><strong>MongoDB Minute</strong><br>
              60-second MongoDB tips for developers</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Episode Review ${isApproved ? "Approved" : "Completed"}

${reviewer.name} has reviewed your episode.

Episode: ${episode.title}
Episode #${episode.episodeNumber || "TBD"}
Category: ${episode.category}
Difficulty: ${episode.difficulty}

${notes ? `Reviewer Notes:\n${notes}\n\n` : ""}

${isApproved
  ? "✅ Next Step: Your episode has passed technical review and is ready for final approval!"
  : "📝 Next Step: Please review the feedback and make the requested changes, then resubmit for review."
}

View Episode: ${episodeUrl}

MongoDB Minute - 60-second MongoDB tips for developers
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending review completed notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification when episode is finally approved
 */
export async function sendFinalApprovalNotification(episode, approver, submitter, notes, baseUrl) {
  const episodeUrl = `${baseUrl}/admin/episodes/${episode._id}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: submitter.email,
    subject: `[MongoDB Minute] Episode Approved for Recording: ${episode.title}`,
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
            .badge {
              display: inline-block;
              padding: 4px 12px;
              background: #00ED64;
              color: #001E2B;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .episode-info {
              background: linear-gradient(135deg, rgba(0, 237, 100, 0.1) 0%, rgba(0, 104, 74, 0.05) 100%);
              border-left: 4px solid #00ED64;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .episode-info h3 {
              margin: 0 0 10px 0;
              color: #001E2B;
            }
            .episode-info p {
              margin: 5px 0;
              color: #5F6C76;
            }
            .success-box {
              background: #E6F9F1;
              border: 1px solid #00ED64;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
              text-align: center;
            }
            .success-box h3 {
              color: #00684A;
              margin: 0 0 10px 0;
              font-size: 24px;
            }
            .notes-box {
              background: #FFF9E6;
              border: 1px solid #FFE5A3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
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
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🎬 MongoDB Minute</h1>
            </div>

            <span class="badge">APPROVED FOR RECORDING</span>

            <div class="success-box">
              <h3>🎉 Episode Approved!</h3>
              <p>Your episode is ready for video recording</p>
            </div>

            <p>${approver.name} has given final approval for your episode.</p>

            <div class="episode-info">
              <h3>${episode.title}</h3>
              <p><strong>Episode #${episode.episodeNumber || "TBD"}</strong></p>
              <p><strong>Category:</strong> ${episode.category}</p>
              <p><strong>Difficulty:</strong> ${episode.difficulty}</p>
            </div>

            ${notes ? `
            <div class="notes-box">
              <strong>Approval Notes:</strong>
              <p style="margin: 10px 0 0 0;">${notes}</p>
            </div>
            ` : ""}

            <p><strong>🎥 Next Steps:</strong></p>
            <ul>
              <li>Use the Teleprompter Mode to record your video</li>
              <li>Edit and upload the video</li>
              <li>Add the video URL to the episode</li>
              <li>Publish when ready!</li>
            </ul>

            <div style="text-align: center;">
              <a href="${episodeUrl}" class="button">Open Teleprompter</a>
            </div>

            <div class="footer">
              <p><strong>MongoDB Minute</strong><br>
              60-second MongoDB tips for developers</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
🎉 Episode Approved for Recording!

${approver.name} has given final approval for your episode.

Episode: ${episode.title}
Episode #${episode.episodeNumber || "TBD"}
Category: ${episode.category}
Difficulty: ${episode.difficulty}

${notes ? `Approval Notes:\n${notes}\n\n` : ""}

🎥 Next Steps:
- Use the Teleprompter Mode to record your video
- Edit and upload the video
- Add the video URL to the episode
- Publish when ready!

Open Episode: ${episodeUrl}

MongoDB Minute - 60-second MongoDB tips for developers
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending final approval notification:", error);
    return { success: false, error: error.message };
  }
}

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
