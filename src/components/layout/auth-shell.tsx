import { BrandLogo } from "@/components/brand/logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogo size="lg" showWordmark priority />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl text-[var(--brand)]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-[var(--muted-fg)]">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
