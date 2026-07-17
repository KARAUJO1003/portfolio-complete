import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background-subtle px-4 py-10 text-foreground">
      <ForgotPasswordForm />
    </main>
  );
}
