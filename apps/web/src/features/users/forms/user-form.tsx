"use client";

import type { UserDto } from "@portfolio/contracts";
import { USER_ROLES } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DsForm, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createUser, updateUser } from "@/features/users/api/users-api";
import { usersKeys } from "@/features/users/api/users-queries";
import { userFormSchema, type UserFormValues } from "@/features/users/schemas/user-form-schema";

export const USER_FORM_ID = "user-form";

type UserFormProps = {
  onDone?: () => void;
  onPendingChange?: (pending: boolean) => void;
  user?: UserDto | null;
};

const ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  owner: "Owner (acesso total)",
  admin: "Admin",
  editor: "Editor",
  viewer: "Visualizador",
};

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "editor",
};

export function UserForm({ onDone, onPendingChange, user }: UserFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<UserFormValues>({
    resolver: typedZodResolver(userFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!user) {
      form.reset(defaultValues);
      return;
    }

    form.reset({ name: user.name, email: user.email, password: "", role: user.role });
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      if (user) {
        return updateUser(user.id, { name: values.name, role: values.role });
      }

      return createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: UserFormValues) {
    if (!user && values.password.length < 8) {
      form.setError("password", { message: "Senha deve ter ao menos 8 caracteres." });
      return;
    }

    await mutation.mutateAsync(values);
  }

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  return (
    <DsForm id={USER_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Nome e email do usuario. O email nao pode ser alterado depois de criado.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Nome" name="name" />
          {user ? (
            <FormField>
              <FormLabel>Email</FormLabel>
              <p className="flex h-7 items-center rounded-md border border-input bg-surface-muted px-2 text-sm text-muted-foreground">
                {user.email}
              </p>
            </FormField>
          ) : (
            <FormFields.Text form={form} label="Email" name="email" type="email" />
          )}
        </div>
        {!user && (
          <FormFields.Text
            description="Minimo 8 caracteres. O usuario pode trocar depois em Esqueci minha senha."
            form={form}
            label="Senha inicial"
            name="password"
            type="password"
          />
        )}
      </FormSection>

      <FormSection title="Acesso" description="O papel define o conjunto de permissoes do usuario.">
        <FormFields.Select
          form={form}
          label="Papel"
          name="role"
          options={USER_ROLES.map((role) => ({ label: ROLE_LABELS[role], value: role }))}
        />
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar usuario.</FormError>}
    </DsForm>
  );
}
