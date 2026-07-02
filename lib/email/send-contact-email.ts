import {
  CONTACT_FROM_EMAIL,
  CONTACT_RECIPIENT_EMAIL,
} from "@/lib/site/contact";
import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");

  if (!host || !user || !pass) {
    return null;
  }

  return { host, user, pass, port };
}

export function isContactEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const smtp = getSmtpConfig();

  if (!smtp) {
    throw new Error("SMTP yapılandırması eksik.");
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const subjectLine = `[İletişim] ${payload.subject}`;
  const text = [
    `Gönderen: ${payload.name}`,
    `E-posta: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  const html = `
    <p><strong>Gönderen:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(payload.email)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  `;

  await transporter.sendMail({
    from: `"Kupon Kodlarım İletişim" <${CONTACT_FROM_EMAIL}>`,
    to: CONTACT_RECIPIENT_EMAIL,
    replyTo: payload.email,
    subject: subjectLine,
    text,
    html,
  });
}
