"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse o admin do portfolio.</CardDescription>
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

          {serverError && <FormError>{serverError}</FormError>}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
