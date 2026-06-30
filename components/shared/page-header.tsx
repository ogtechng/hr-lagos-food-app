import { BackButton } from "@/components/shared/back-button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  titleAccent?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  titleAccent,
  description,
  backHref,
  backLabel,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[var(--admin-primary-strong)] p-5 text-white md:p-6",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          background:
            "radial-gradient(circle at 88% -12%, rgba(82,82,82,0.34), transparent 28%), radial-gradient(circle at 18% 22%, rgba(217,249,157,0.12), transparent 24%), linear-gradient(135deg, rgba(2,44,34,0.98), rgba(2,6,23,0.96) 62%, rgba(6,78,59,0.9))",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 top-[-70%] hidden h-72 w-72 rounded-full border border-white/12 md:block"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl space-y-2">
          {backHref && (
            <BackButton
              href={backHref}
              label={backLabel}
              className="mb-2 text-white/60 hover:text-[var(--admin-lemon)]"
            />
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="text-[var(--admin-lemon)]">{titleAccent}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm leading-6 text-white/65">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 [&_[data-slot=button]]:rounded-lg">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
