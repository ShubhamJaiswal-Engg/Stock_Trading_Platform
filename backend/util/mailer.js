const transporter = require("../config/nodemailer");

const BREVO_SEND_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

const DEFAULT_FROM_NAME = process.env.MAIL_FROM_NAME || "StockX";
const DEFAULT_FROM_EMAIL =
  process.env.SENDER_EMAIL ||
  process.env.MAIL_FROM_EMAIL ||
  process.env.SMTP_USER ||
  process.env.BREVO_SMTP_USER ||
  process.env.BREVO_SMTP_LOGIN;

function isLikelyBrevoSmtpKey(value) {
  if (!value) return false;
  const key = String(value).trim();
  // Brevo SMTP keys are typically prefixed with `xsmtpsib-`.
  return key.toLowerCase().startsWith("xsmtpsib-");
}

function getBrevoApiKey() {
  const raw = process.env.BREVO_API_KEY;
  if (!raw) return null;
  const key = String(raw).trim();
  if (!key) return null;
  if (isLikelyBrevoSmtpKey(key)) return null;
  return key;
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function sendViaBrevoApi({ toEmail, subject, text, fromEmail, fromName }) {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    if (isLikelyBrevoSmtpKey(process.env.BREVO_API_KEY)) {
      throw new Error(
        "BREVO_API_KEY looks like an SMTP key (xsmtpsib-...). Use a Brevo API key (usually xkeysib-...) or remove BREVO_API_KEY to send via SMTP."
      );
    }
    throw new Error("BREVO_API_KEY is missing");
  }

  const timeoutMs = Number(process.env.BREVO_API_TIMEOUT_MS || 10_000);
  const { signal, clear } = withTimeout(timeoutMs);

  try {
    const response = await fetch(BREVO_SEND_EMAIL_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: fromName || DEFAULT_FROM_NAME,
          email: fromEmail || DEFAULT_FROM_EMAIL,
        },
        to: [{ email: toEmail }],
        subject,
        textContent: text,
      }),
      signal,
    });

    const raw = await response.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch (_e) {
      parsed = raw;
    }

    if (!response.ok) {
      const detail =
        (parsed && (parsed.message || parsed.error || parsed.code)) ||
        (typeof parsed === "string" ? parsed : "Brevo API error");
      throw new Error(`Brevo API failed (${response.status}): ${detail}`);
    }

    return parsed;
  } finally {
    clear();
  }
}

async function sendViaSmtp({ toEmail, subject, text, fromEmail }) {
  if (!transporter) {
    throw new Error("SMTP transporter not configured");
  }
  return transporter.sendMail({
    from: fromEmail || DEFAULT_FROM_EMAIL,
    to: toEmail,
    subject,
    text,
  });
}

async function sendTextEmail({ toEmail, subject, text, fromEmail, fromName }) {
  // Prefer Brevo HTTP API in production (avoids outbound SMTP port blocks/timeouts).
  if (process.env.BREVO_API_KEY && isLikelyBrevoSmtpKey(process.env.BREVO_API_KEY)) {
    console.warn(
      "[mailer] BREVO_API_KEY appears to be an SMTP key (xsmtpsib-...). Falling back to SMTP transport."
    );
  }

  if (getBrevoApiKey()) {
    return sendViaBrevoApi({ toEmail, subject, text, fromEmail, fromName });
  }
  return sendViaSmtp({ toEmail, subject, text, fromEmail });
}

async function sendResetOtpEmail(toEmail, otp) {
  return sendTextEmail({
    toEmail,
    subject: "Password Reset Otp",
    text: `Your otp for reseting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
  });
}

module.exports = {
  sendTextEmail,
  sendResetOtpEmail,
};
