"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { forgotPasswordRequest } from "@/core/auth/api/auth-api";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { useAdminThemeScope } from "@/hooks/use-admin-theme-scope";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgot-password-schema";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  useAdminThemeScope();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: typedZodResolver(forgotPasswordFormSchema),
    mode: "onSubmit",
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    try {
      await forgotPasswordRequest(values);
      setSent(true);
    } catch {
      setServerError("Não foi possível processar o pedido. Tente novamente.");
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/95 shadow-2xl shadow-black/10">
      <CardHeader className="gap-4">
        <div>
          <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
          <CardDescription className="mt-2 leading-6">
            Informe seu email e enviaremos um link para redefinir a senha.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Se o email informado tiver uma conta, enviamos um link de redefinição. Verifique sua caixa de entrada.
          </p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
              {form.formState.errors.email?.message && (
                <FormError>{form.formState.errors.email.message}</FormError>
              )}
            </FormField>

            {serverError && <FormError>{serverError}</FormError>}

            <Button className="mt-2" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Enviando..." : "Enviar link"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link className="underline underline-offset-4" href="/login">
            Voltar para o login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
