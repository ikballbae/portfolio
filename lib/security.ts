import { z } from 'zod';

// Disallow CR (\r) and LF (\n) to prevent email header injection
const noCrLfRegex = /^[^\\r\\n]+$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nama minimal 2 karakter' })
    .max(80, { message: 'Nama maksimal 80 karakter' })
    .refine((val) => !/[\r\n]/.test(val), {
      message: 'Nama tidak boleh mengandung karakter baris baru (CR/LF)',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Format email tidak valid' })
    .max(254, { message: 'Email maksimal 254 karakter' })
    .refine((val) => !/[\r\n]/.test(val), {
      message: 'Email tidak boleh mengandung karakter baris baru (CR/LF)',
    }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Pesan minimal 10 karakter' })
    .max(2000, { message: 'Pesan maksimal 2000 karakter' }),
  hp: z.string().optional().default(''), // Honeypot
  turnstileToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Escape HTML special characters to prevent HTML/XSS injection in email clients
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Mask email address for privacy-safe logging (e.g. a***r@example.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Extract client IP from headers
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    return ips[0].trim();
  }
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * Check if the request Origin or Referer is in the allowed whitelist
 */
export function isAllowedOrigin(headers: Headers): boolean {
  const origin = headers.get('origin');
  const referer = headers.get('referer');

  const allowedDomains = [
    'akhmadikbal.web.id',
    'ahmdikball.vercel.app',
    'localhost',
    '127.0.0.1',
  ];

  const checkUrl = (urlStr: string | null): boolean => {
    if (!urlStr) return false;
    try {
      const parsed = new URL(urlStr);
      return allowedDomains.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  };

  // If origin is present, check origin
  if (origin) {
    return checkUrl(origin);
  }

  // If referer is present, check referer
  if (referer) {
    return checkUrl(referer);
  }

  // Allow tool requests (curl/postman/test scripts) in local development only
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  return false;
}

/**
 * Verify Cloudflare Turnstile token via siteverify endpoint
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  clientIp: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If secret key is not set (e.g. during local dev before user setup)
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Turnstile] TURNSTILE_SECRET_KEY not set in production');
    }
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'Token Turnstile tidak ditemukan' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', clientIp);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    );

    const data = await response.json();
    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: 'Verifikasi bot Cloudflare Turnstile gagal',
    };
  } catch (err) {
    console.error('[Turnstile] Verification request error');
    return {
      success: false,
      error: 'Gagal memverifikasi token keamanan',
    };
  }
}
