"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: typedZodResolver(loginFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await auth.login(values);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/admin") ? next : "/admin");
    } catch {
      setServerError("Credenciais invalidas.");
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/95 shadow-2xl shadow-black/10">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge tone="muted">Credenciais</Badge>
          <span className="text-xs text-muted-foreground">Sessao segura</span>
        </div>
        <div>
          <CardTitle className="text-2xl">Entrar no admin</CardTitle>
          <CardDescription className="mt-2 leading-6">
            Acesse o painel para editar portfolio, curriculo, projetos e publicacoes.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email?.message && (
              <FormError>{form.formState.errors.email.message}</FormError>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password?.message && (
              <FormError>{form.formState.errors.password.message}</FormError>
            )}
          </FormField>

          {serverError && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
              <FormError>{serverError}</FormError>
            </div>
          )}

          <Button className="mt-2" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            <Link className="underline underline-offset-4" href="/forgot-password">
              Esqueci minha senha
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
