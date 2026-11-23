import { NextResponse } from 'next/server';
import {
  contactFormSchema,
  maskEmail,
  getClientIp,
  isAllowedOrigin,
  verifyTurnstileToken,
} from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limiter';
import {
  generateContactEmailHtml,
  generateContactEmailText,
} from '@/lib/email-template';

const MAX_BODY_BYTES = 10 * 1024; // 10KB limit

/**
 * Handle non-POST HTTP methods -> 405 Method Not Allowed
 */
function methodNotAllowed() {
  return NextResponse.json(
    { error: 'Metode tidak diizinkan.' },
    {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    }
  );
}

export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function POST(request) {
  try {
    // 1. Origin & Referer Verification
    if (!isAllowedOrigin(request.headers)) {
      return NextResponse.json(
        { error: 'Permintaan ditolak: Origin atau Referer tidak sah.' },
        { status: 403 }
      );
    }

    // 2. Content-Type Verification
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { error: 'Format data tidak didukung. Harap gunakan application/json.' },
        { status: 415 }
      );
    }

    // 3. Payload Size Limitation (Content-Length header check)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran payload terlalu besar (maksimal 10KB).' },
        { status: 413 }
      );
    }

    // Read and verify raw body text size
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran payload terlalu besar (maksimal 10KB).' },
        { status: 413 }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Format JSON tidak valid.' },
        { status: 400 }
      );
    }

    // 4. Rate Limiting per Client IP (3 requests per 10 minutes)
    const clientIp = getClientIp(request.headers);
    const rateLimit = await checkRateLimit(clientIp);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
          },
        }
      );
    }

    // 5. Anti-Bot Honeypot: Silent fake success without sending email
    if (parsedBody?.hp && String(parsedBody.hp).trim().length > 0) {
      console.warn(`[Security] Honeypot triggered from IP: ${clientIp}`);
      return NextResponse.json(
        { success: true, message: 'Pesan berhasil dikirim.' },
        { status: 200 }
      );
    }

    // 6. Input Validation with Zod (name, email, message, no CR/LF)
    const validation = contactFormSchema.safeParse(parsedBody);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstErrorMessage =
        fieldErrors.name?.[0] ||
        fieldErrors.email?.[0] ||
        fieldErrors.message?.[0] ||
        'Input tidak valid. Periksa kembali form Anda.';

      return NextResponse.json(
        {
          error: firstErrorMessage,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, turnstileToken } = validation.data;

    // 7. Cloudflare Turnstile Verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { error: turnstileResult.error || 'Verifikasi keamanan bot gagal.' },
        { status: 400 }
      );
    }

    // 8. Generate Sanitized Email Template
    const now = new Date();
    const htmlBody = generateContactEmailHtml({ name, email, message, date: now });
    const plainText = generateContactEmailText({ name, email, message, date: now });

    // 9. Send Email via Resend REST API
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'akhmadikbalkhoir@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    if (!resendApiKey) {
      // In development or when API key is not yet provided, simulate successful send
      console.log(`[Contact Form] Dev mode: RESEND_API_KEY not configured. Message simulated for sender: ${maskEmail(email)}`);
      return NextResponse.json({
        success: true,
        message: 'Pesan berhasil dikirim! Saya akan segera merespons.',
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email, // Direct reply to sender
        subject: `[Portfolio] Pesan dari ${name}`,
        text: plainText,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      let errorMsg = 'Gagal mengirim pesan, coba lagi nanti.';
      try {
        const errorJson = JSON.parse(errorText);
        console.error('[Contact Form] Resend API error:', emailResponse.status, errorJson.message || errorJson);
        if (process.env.NODE_ENV !== 'production' && errorJson.message) {
          errorMsg = `[Resend] ${errorJson.message}`;
        }
      } catch {
        console.error('[Contact Form] Resend API error text:', emailResponse.status, errorText);
      }

      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    console.log(`[Contact Form] Email successfully dispatched for sender: ${maskEmail(email)}`);
    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim! Saya akan segera merespons.',
    });
  } catch (err) {
    console.error('[Contact Form] Internal server error');
    return NextResponse.json(
      { error: 'Gagal mengirim pesan, coba lagi nanti.' },
      { status: 500 }
    );
  }
}
