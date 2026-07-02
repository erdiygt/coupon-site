"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Mesaj gönderilemedi.");
        setFormState("error");
        return;
      }

      form.reset();
      setFormState("success");
    } catch {
      setErrorMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
      setFormState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-foreground">Bize Yazın</h2>
      <p className="mt-2 text-sm text-muted">
        Formu doldurun; mesajınız doğrudan ekibimize iletilir.
      </p>

      {formState === "success" ? (
        <div
          className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          role="status"
        >
          Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Ad Soyad
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                E-posta
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-foreground">
              Konu
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              minLength={3}
              maxLength={160}
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
              Mesajınız
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              className="w-full resize-y rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {formState === "error" && errorMessage ? (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={formState === "submitting"}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formState === "submitting" ? "Gönderiliyor..." : "Mesajı Gönder"}
          </button>
        </form>
      )}
    </div>
  );
}
