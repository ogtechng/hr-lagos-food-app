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
        "hero-noise relative overflow-hidden rounded-3xl border border-[#0c5b30] bg-[#064b28] p-5 text-[#f2f0e6] md:p-6",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 top-5 hidden h-16 w-48 rotate-12 rounded-full border border-[#f2f0e6]/20 md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-4 hidden h-px w-48 -rotate-12 bg-[#dfff67]/30 md:block"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl space-y-2">
          {backHref && (
            <BackButton
              href={backHref}
              label={backLabel}
              className="mb-2 text-[#c7ddbd] hover:text-[#f2f0e6]"
            />
          )}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="text-[#dfff67]">{titleAccent}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm leading-6 text-[#d9e8d2]">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 [&_[data-slot=button]]:rounded-full [&_[data-slot=button]]:border-[#dfff67]/60 [&_[data-slot=button]]:bg-[#dfff67] [&_[data-slot=button]]:text-[#063b21] [&_[data-slot=button]]:hover:bg-[#ecff93]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
