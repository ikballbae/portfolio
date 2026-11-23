/**
 * Escape karakter spesial HTML untuk mencegah XSS / HTML injection pada email client
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format tanggal dalam zona waktu WIB (Asia/Jakarta)
 * Format output: "24 Nov 2026, 00.20 WIB"
 */
export function formatWibDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const day = parts.find((p) => p.type === 'day')?.value || '';
  const month = (parts.find((p) => p.type === 'month')?.value || '').replace('.', '');
  const year = parts.find((p) => p.type === 'year')?.value || '';
  const hour = parts.find((p) => p.type === 'hour')?.value || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value || '00';

  return `${day} ${month} ${year}, ${hour}.${minute} WIB`;
}

/**
 * Template HTML Email Notifikasi Kontak
 * Mengikuti pedoman desain:
 * - Mengikuti mode terang/gelap Gmail secara alami (tanpa forced background)
 * - Card rata kiri, max-width 560px, padding lega
 * - Garis aksen hijau neon tipis 3px di bagian atas
 * - Table-based layout dengan inline CSS & support dark mode
 */
export function generateContactEmailHtml({ name, email, message, date = new Date() }) {
  const safeName = escapeHtml(name || '');
  const safeEmail = escapeHtml(email || '');
  const timeString = formatWibDate(date);
  const safeTimeString = escapeHtml(timeString);

  // Preheader: 20 karakter pertama dari pesan asli
  const rawFirst20 = (message || '').trim().slice(0, 20);
  const safePreheader = escapeHtml(`${name}: ${rawFirst20}`);

  // Escape pesan lalu ganti newline dengan <br>
  const escapedMessage = escapeHtml(message || '');
  const formattedMessageHtml = escapedMessage.replace(/\r\n|\n|\r/g, '<br>');

  // Mailto reply URL
  const replySubject = encodeURIComponent(`Re: [Portfolio] Pesan dari ${name}`);
  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${replySubject}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Pesan baru dari portfolio</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-card {
        border-color: #3f3f46 !important;
      }
      .text-primary {
        color: #fafafa !important;
      }
      .text-secondary {
        color: #a1a1aa !important;
      }
      .btn-reply {
        border-color: #3f3f46 !important;
        color: #fafafa !important;
      }
      .meta-link {
        color: #fafafa !important;
      }
      .divider-line {
        border-color: #27272a !important;
      }
    }
    @media only screen and (max-width: 600px) {
      .email-card-td {
        padding: 24px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; word-break: break-word;">
  <!-- Preheader tersembunyi untuk cuplikan inbox -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; opacity: 0; color: transparent;">
    ${safePreheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="left">
        <!-- Main Card Container: max-width 560px, rata kiri, tanpa background paksa -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-card" style="width: 100%; max-width: 560px; border: 1px solid #d4d4d8; border-radius: 8px; overflow: hidden; border-spacing: 0;">
          <!-- 1. Garis aksen tipis hijau neon (#c4ff00) setinggi 3px di bagian atas card -->
          <tr>
            <td style="height: 3px; line-height: 3px; font-size: 3px; background-color: #c4ff00; padding: 0;">&nbsp;</td>
          </tr>

          <!-- Card Content Body -->
          <tr>
            <td class="email-card-td" style="padding: 32px 28px; text-align: left;">
              <!-- 2. Judul kecil: "Pesan baru dari portfolio" (sans, 18px, semi-bold) -->
              <h1 class="text-primary" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; line-height: 1.3; color: #18181b; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                Pesan baru dari portfolio
              </h1>

              <!-- 3. Baris meta: NAMA, EMAIL, WAKTU -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 24px; border-spacing: 0;">
                <tr>
                  <td style="padding: 4px 0; vertical-align: top; width: 68px;">
                    <span class="text-secondary" style="font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">NAMA</span>
                  </td>
                  <td style="padding: 4px 0; vertical-align: top;">
                    <span class="text-primary" style="font-size: 14px; font-weight: 500; color: #18181b; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">${safeName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; vertical-align: top; width: 68px;">
                    <span class="text-secondary" style="font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">EMAIL</span>
                  </td>
                  <td style="padding: 4px 0; vertical-align: top;">
                    <a href="mailto:${safeEmail}" class="meta-link" style="font-size: 14px; color: #18181b; text-decoration: underline; text-underline-offset: 2px; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; vertical-align: top; width: 68px;">
                    <span class="text-secondary" style="font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">WAKTU</span>
                  </td>
                  <td style="padding: 4px 0; vertical-align: top;">
                    <span class="text-secondary" style="font-size: 13px; color: #71717a; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">${safeTimeString}</span>
                  </td>
                </tr>
              </table>

              <!-- 4. Isi pesan: blok dengan border kiri 2px warna aksen (#c4ff00), teks 15-16px, line-height 1.6 -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 28px; border-spacing: 0;">
                <tr>
                  <td style="border-left: 2px solid #c4ff00; padding: 4px 0 4px 16px;">
                    <div class="text-primary" style="font-size: 15px; line-height: 1.6; color: #18181b; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0;">
                      ${formattedMessageHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- 5. Tombol/link teks outline: "Balas ke {nama}" -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; border-spacing: 0;">
                <tr>
                  <td>
                    <a href="${mailtoUrl}" class="btn-reply" style="display: inline-block; padding: 9px 18px; border: 1px solid #d4d4d8; border-radius: 6px; font-size: 13px; font-weight: 500; color: #18181b; text-decoration: none; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                      Balas ke ${safeName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 6. Footer kecil abu: "Dikirim dari akhmadikbal.web.id" -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-spacing: 0;">
                <tr>
                  <td class="divider-line" style="padding-top: 14px; border-top: 1px solid #e4e4e7;">
                    <p class="text-secondary" style="margin: 0; font-size: 12px; color: #71717a; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                      Dikirim dari <a href="https://akhmadikbal.web.id" class="text-secondary" style="color: #71717a; text-decoration: underline;">akhmadikbal.web.id</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Template Plain Text Email Notifikasi Kontak
 */
export function generateContactEmailText({ name, email, message, date = new Date() }) {
  const timeString = formatWibDate(date);
  return `Pesan baru dari portfolio (akhmadikbal.web.id)

NAMA : ${name}
EMAIL: ${email}
WAKTU: ${timeString}

PESAN:
${message}

---
Balas langsung ke: ${email}
`;
}
