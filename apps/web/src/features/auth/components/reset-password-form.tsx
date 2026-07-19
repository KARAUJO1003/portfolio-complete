"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { resetPasswordRequest } from "@/core/auth/api/auth-api";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { useAdminThemeScope } from "@/hooks/use-admin-theme-scope";
import { resetPasswordFormSchema, type ResetPasswordFormValues } from "@/features/auth/schemas/reset-password-schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  useAdminThemeScope();

  const form = useForm<ResetPasswordFormValues>({
    resolver: typedZodResolver(resetPasswordFormSchema),
    mode: "onSubmit",
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    try {
      await resetPasswordRequest({ token, password: values.password });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setServerError("Link inválido ou expirado. Peça um novo link.");
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md border-border bg-card/95 shadow-2xl shadow-black/10">
        <CardHeader>
          <CardTitle className="text-2xl">Link inválido</CardTitle>
          <CardDescription className="mt-2 leading-6">
            Este link de redefinição está incompleto. Solicite um novo em{" "}
            <Link className="underline underline-offset-4" href="/forgot-password">
              esqueci minha senha
            </Link>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/95 shadow-2xl shadow-black/10">
      <CardHeader className="gap-4">
        <div>
          <CardTitle className="text-2xl">Redefinir senha</CardTitle>
          <CardDescription className="mt-2 leading-6">Escolha uma nova senha para sua conta.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {done ? (
          <p className="text-sm leading-6 text-muted-foreground">Senha redefinida. Redirecionando para o login...</p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField>
              <FormLabel htmlFor="password">Nova senha</FormLabel>
              <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
              {form.formState.errors.password?.message && (
                <FormError>{form.formState.errors.password.message}</FormError>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="confirmPassword">Confirmar senha</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword?.message && (
                <FormError>{form.formState.errors.confirmPassword.message}</FormError>
              )}
            </FormField>

            {serverError && <FormError>{serverError}</FormError>}

            <Button className="mt-2" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
