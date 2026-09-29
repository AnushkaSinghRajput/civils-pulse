"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email")).trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send reset link");
      return;
    }
    setDone(true);
    if (typeof data.devResetUrl === "string") {
      setDevResetUrl(data.devResetUrl);
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your account email and we’ll send a reset link if it exists."
    >
      {done ? (
        <div className="space-y-4 text-sm">
          <p className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            If an account exists for that email, a reset link has been sent. Check your inbox
            and spam folder.
          </p>
          {devResetUrl && (
            <p className="rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] p-3 text-[var(--brand)]">
              Dev only —{" "}
              <Link href={devResetUrl} className="break-all underline">
                open reset link
              </Link>
            </p>
          )}
          <p className="text-center">
            <Link href="/login" className="text-[var(--brand)] underline">
              Back to log in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm" htmlFor="email">
              Email
            </label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm text-[var(--muted-fg)]">
            Remembered it?{" "}
            <Link href="/login" className="text-[var(--brand)] underline">
              Log in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
