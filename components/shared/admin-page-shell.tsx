import { cn } from "@/lib/utils";

interface AdminPageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageShell({ children, className }: AdminPageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] space-y-6 p-4 md:p-6", className)}>
      {children}
    </div>
  );
}
