type OtpEmailOptions = {
  code: string | number;
  expiresInMinutes?: number;
  name?: string;
};

export function otpEmailTemplate({
  code,
  expiresInMinutes = 10,
  name,
}: OtpEmailOptions) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your StockFlow verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <!-- Preheader (inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your StockFlow verification code is ${code}. It expires in ${expiresInMinutes} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:28px 32px;" align="center">
              <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Stock<span style="color:#38bdf8;">Flow</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px 32px;">
              <h1 style="margin:0 0 12px 0;font-size:22px;color:#0f172a;">Verify your email</h1>
              <p style="margin:0 0 8px 0;font-size:15px;line-height:24px;color:#475569;">${greeting}</p>
              <p style="margin:0;font-size:15px;line-height:24px;color:#475569;">
                Welcome to StockFlow! Use the code below to verify your email address and finish setting up your account.
              </p>
            </td>
          </tr>

          <!-- Code -->
          <tr>
            <td align="center" style="padding:28px 32px;">
              <div style="display:inline-block;background-color:#f0f9ff;border:1px dashed #38bdf8;border-radius:10px;padding:16px 28px;">
                <span style="font-size:34px;font-weight:700;letter-spacing:10px;color:#0f172a;font-family:'Courier New',Courier,monospace;">
                  ${code}
                </span>
              </div>
              <p style="margin:16px 0 0 0;font-size:13px;color:#64748b;">
                This code expires in <strong>${expiresInMinutes} minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <p style="margin:0;font-size:13px;line-height:20px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:20px;">
                Didn't request this? You can safely ignore this email. Never share this code with anyone, as the StockFlow team will never ask for it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;" align="center">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; ${year} StockFlow. Smart inventory, always in flow.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${greeting}

Welcome to StockFlow! Your verification code is: ${code}

This code expires in ${expiresInMinutes} minutes.

If you didn't request this, you can ignore this email. Never share this code with anyone.

- The StockFlow Team`;

  return { html, text };
}
