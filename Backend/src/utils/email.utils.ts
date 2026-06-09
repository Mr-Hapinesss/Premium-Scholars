import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendPasswordResetEmail = async (
  toEmail:   string,
  toName:    string,
  resetUrl:  string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f0f9ff;font-family:'DM Sans',system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e0f2fe;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0284c7,#075985);padding:36px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
            Premium <span style="color:#fbbf24;">Scholars</span>
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <h2 style="margin:0 0 12px;color:#0c4a6e;font-size:22px;font-weight:700;">
            Reset your password
          </h2>
          <p style="margin:0 0 8px;color:#0369a1;font-size:15px;line-height:1.6;">
            Hi ${toName},
          </p>
          <p style="margin:0 0 28px;color:#0369a1;font-size:15px;line-height:1.6;">
            We received a request to reset your Premium Scholars password.
            Click the button below to choose a new one. This link expires in
            <strong>1 hour</strong>.
          </p>

          <div style="text-align:center;margin-bottom:28px;">
            
              href="${resetUrl}"
              style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:14px;"
            >
              Reset Password
            </a>
          </div>

          <p style="margin:0 0 8px;color:#7dd3fc;font-size:13px;line-height:1.6;">
            Or copy this link into your browser:
          </p>
          <p style="margin:0 0 28px;word-break:break-all;color:#0284c7;font-size:12px;background:#f0f9ff;padding:12px 16px;border-radius:10px;border:1px solid #e0f2fe;">
            ${resetUrl}
          </p>

          <p style="margin:0;color:#7dd3fc;font-size:13px;line-height:1.6;">
            If you did not request a password reset, you can safely ignore this
            email. Your password will not change.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f0f9ff;padding:20px 40px;text-align:center;border-top:1px solid #e0f2fe;">
          <p style="margin:0;color:#7dd3fc;font-size:12px;">
            © ${new Date().getFullYear()} Premium Scholars. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || 'Premium Scholars <no-reply@premiumscholars.co.ke>',
    to:      toEmail,
    subject: 'Reset your Premium Scholars password',
    html,
  })
}

export const verifyEmailConnection = async (): Promise<void> => {
  try {
    await transporter.verify()
    console.log('✅ Email transporter ready')
  } catch (err) {
    console.warn('⚠️  Email transporter not configured:', (err as Error).message)
  }
}