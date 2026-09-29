"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed");
      setPending(false);
      return;
    }
    const signed = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    setPending(false);
    if (signed?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Create account
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">Free plan includes core PYQ access.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm" htmlFor="name">
            Name
          </label>
          <Input id="name" name="name" required minLength={2} autoComplete="name" />
        </div>
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
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted-fg)]">
        Already registered?{" "}
        <Link href="/login" className="text-[var(--brand)] underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
