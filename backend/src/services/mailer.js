import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// ─── Brevo SMTP Transporter ───
const hasBrevoCreds = env.brevoSmtpUser && env.brevoSmtpKey;

const transporter = hasBrevoCreds
  ? nodemailer.createTransport({
      host: env.brevoSmtpHost,
      port: env.brevoSmtpPort,
      secure: env.brevoSmtpPort === 465,
      auth: {
        user: env.brevoSmtpUser,
        pass: env.brevoSmtpKey
      }
    })
  : null;

if (hasBrevoCreds) {
  console.log("✅ Brevo email transporter ready");
} else {
  console.warn("⚠️  Brevo credentials missing — emails disabled");
}

// ─── Shared Styles ───
const brandColor = "#B8860B";
const bgColor = "#F9F7F4";
const cardBg = "#FFFFFF";
const textPrimary = "#1A1A1A";
const textSecondary = "#666666";

function emailWrapper(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:${bgColor};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgColor};padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:${cardBg};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,${brandColor},#8B6914);padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:700;letter-spacing:1px;">
                    BhardwajDeco
                  </h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                    Premium Surfaces & Décor
                  </p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;border-top:1px solid #EAEAEA;text-align:center;">
                  <p style="margin:0;color:${textSecondary};font-size:12px;line-height:1.6;">
                    © ${new Date().getFullYear()} BhardwajDeco. All rights reserved.<br>
                    Premium Laminates • Wall Cladding • Soft Stone • Louver Panels
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send a confirmation/acknowledgement email to the customer.
 * Called automatically when an enquiry is submitted.
 */
export async function sendCustomerConfirmation(enquiry) {
  if (!transporter) return;

  const productName = enquiry.productName || "General Enquiry";

  const content = `
    <h2 style="margin:0 0 8px;color:${textPrimary};font-size:22px;font-weight:600;">
      Thank You, ${enquiry.name}! 🙏
    </h2>
    <p style="margin:0 0 24px;color:${textSecondary};font-size:15px;line-height:1.7;">
      We've received your enquiry and our team will get back to you within
      <strong style="color:${textPrimary};">24 hours</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgColor};border-radius:12px;padding:24px;margin:0 0 24px;">
      <tr>
        <td>
          <p style="margin:0 0 4px;color:${brandColor};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">
            Your Enquiry Details
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;width:120px;vertical-align:top;">Product</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;font-weight:600;">${productName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Name</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Phone</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">${enquiry.phone}</td>
            </tr>
            ${enquiry.message ? `
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Message</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">${enquiry.message}</td>
            </tr>
            ` : ""}
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:${textSecondary};font-size:14px;line-height:1.7;">
      If you have any urgent questions, feel free to reply to this email directly.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: `"${env.brevoSenderName}" <${env.brevoSenderEmail}>`,
      to: enquiry.email,
      subject: `We received your enquiry for ${productName} — BhardwajDeco`,
      html: emailWrapper(content)
    });
    console.log(`📧 Confirmation sent to ${enquiry.email}`);
  } catch (error) {
    console.error("Customer confirmation email failed:", error.message);
  }
}

/**
 * Send a notification email to the admin about a new enquiry.
 */
export async function sendAdminNotification(enquiry) {
  if (!transporter || !env.adminNotificationEmail) return;

  const productName = enquiry.productName || "General Enquiry";

  const content = `
    <h2 style="margin:0 0 8px;color:${textPrimary};font-size:22px;font-weight:600;">
      🔔 New Enquiry Received
    </h2>
    <p style="margin:0 0 24px;color:${textSecondary};font-size:15px;line-height:1.7;">
      A new product enquiry was submitted on
      <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgColor};border-radius:12px;padding:24px;margin:0 0 24px;">
      <tr>
        <td>
          <p style="margin:0 0 4px;color:${brandColor};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">
            Enquiry Details
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;width:120px;vertical-align:top;">Product</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;font-weight:600;">${productName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Customer</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Email</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">
                <a href="mailto:${enquiry.email}" style="color:${brandColor};">${enquiry.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Phone</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">
                <a href="tel:${enquiry.phone}" style="color:${brandColor};">${enquiry.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${textSecondary};font-size:14px;vertical-align:top;">Message</td>
              <td style="padding:8px 0;color:${textPrimary};font-size:14px;">${enquiry.message || "—"}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:${brandColor};border-radius:8px;padding:14px 32px;">
          <a href="${env.frontendUrl}/admin/enquiries" style="color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.5px;">
            View in Dashboard →
          </a>
        </td>
      </tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: `"${env.brevoSenderName}" <${env.brevoSenderEmail}>`,
      to: env.adminNotificationEmail,
      replyTo: enquiry.email,
      subject: `New Enquiry: ${productName} — ${enquiry.name}`,
      html: emailWrapper(content)
    });
    console.log(`📧 Admin notification sent for enquiry from ${enquiry.name}`);
  } catch (error) {
    console.error("Admin notification email failed:", error.message);
  }
}
