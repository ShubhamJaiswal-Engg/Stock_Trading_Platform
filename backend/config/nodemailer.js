const nodemailer = require('nodemailer');

 const SMTP_SECURE = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' ||
  process.env.SMTP_PORT === 465;

// Keep old names working, but allow Brevo-specific env vars too.
const SMTP_USER =
  process.env.SMTP_USER ||
  process.env.BREVO_SMTP_USER;

const SMTP_PASS =
  process.env.SMTP_PASS ||
  process.env.BREVO_SMTP_PASS;

// if (!SMTP_USER || !SMTP_PASS) {
//   // Don't crash the server — but make the issue obvious in logs.
//   console.warn('[mailer] Missing SMTP credentials. Set SMTP_USER/SMTP_PASS (or BREVO_SMTP_LOGIN/BREVO_SMTP_KEY).');
// }

// console.log('[mailer] SMTP config', {
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: SMTP_SECURE,
//   hasUser: Boolean(SMTP_USER),
//   hasPass: Boolean(SMTP_PASS),
// });

const mask = (value) => {
  if (!value) return value;
  const str = String(value);
  if (str.length <= 6) return '***';
  return `${str.slice(0, 3)}***${str.slice(-3)}`;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: SMTP_SECURE, // true for port 465
  pool: true,
  maxConnections: 2,
  maxMessages: 20,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify SMTP at startup to fail-fast with clear logs.
// transporter
//   .verify()
//   .then(() => {
//     console.log('[mailer] SMTP verify: OK');
//   })
//   .catch((err) => {
//     const code = err?.code || err?.responseCode;
//     console.error('[mailer] SMTP verify: FAILED', {
//       code,
//       message: err?.message,
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: SMTP_SECURE,
//       user: mask(SMTP_USER),
//     });

//     if (err?.code === 'EAUTH' || err?.responseCode === 535) {
//       console.error(
//         '[mailer] Auth failed (535). For Brevo, ensure you are using the SMTP Login + SMTP Key (not an API key). Also check Brevo Settings → SMTP & API: if IP allowlisting is enabled, you must authorize your server IP. Then restart the server.'
//       );
//     }
//   });

module.exports = transporter;