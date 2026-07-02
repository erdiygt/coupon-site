import { getClientIp, isSameOriginRequest } from "@/lib/auth/guards";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { CONTACT_FORM_RATE_LIMIT, checkRateLimit } from "@/lib/security/rate-limit";
import { ContactFormSchema, validationErrorResponse } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(
    `contact:${ip}`,
    CONTACT_FORM_RATE_LIMIT.maxRequests,
    CONTACT_FORM_RATE_LIMIT.windowMs,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Çok fazla mesaj gönderdiniz. ${rateLimit.retryAfterSeconds} saniye sonra tekrar deneyin.`,
      },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = ContactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationErrorResponse(parsed.error), { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  try {
    await sendContactEmail({
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim(),
      subject: parsed.data.subject.trim(),
      message: parsed.data.message.trim(),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Mesajınız şu an gönderilemedi. Lütfen daha sonra tekrar deneyin veya doğrudan e-posta gönderin.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
