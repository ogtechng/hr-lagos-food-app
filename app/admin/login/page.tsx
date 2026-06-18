import { redirectIfAdmin } from "@/features/auth/services/auth.service";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function AdminLoginPage() {
  await redirectIfAdmin();

  return (
    <main className="flex min-h-[100dvh]  items-center justify-center bg-muted  px-4 py-10">
      <LoginForm />
    </main>
  );
}
