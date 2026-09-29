"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Log in
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        Access verified PYQs and your mock history.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm" htmlFor="email">
            Email
          </label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="mb-1 block text-sm" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted-fg)]">
        No account?{" "}
        <Link href="/register" className="text-[var(--brand)] underline">
          Register
        </Link>
      </p>
    </div>
  );
}
