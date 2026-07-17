import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background-subtle px-4 py-10 text-foreground">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
