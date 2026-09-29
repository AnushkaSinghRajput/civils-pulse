"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    if (password !== confirm) {
      setError("Passwords do not match");
      setPending(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        email: String(form.get("email") || email),
        password,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Could not reset password");
      return;
    }
    router.push("/login?reset=1");
    router.refresh();
  }

  if (!token || !email) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
          Reset password
        </h1>
        <p className="mt-4 text-sm text-red-700">
          This reset link is missing required details. Request a new one from the
          login page.
        </p>
        <Link href="/forgot-password" className="mt-6 text-sm text-[var(--brand)] underline">
          Forgot password
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Set a new password
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        Choose a new password for {email}.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input type="hidden" name="email" value={email} />
        <div>
          <label className="mb-1 block text-sm" htmlFor="password">
            New password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" htmlFor="confirm">
            Confirm password
          </label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted-fg)]">
        <Link href="/login" className="text-[var(--brand)] underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[var(--muted-fg)]">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
