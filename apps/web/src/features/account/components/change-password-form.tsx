"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DsForm, FormActions, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { changePasswordRequest } from "@/core/auth/api/auth-api";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from "@/features/account/schemas/change-password-schema";

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function ChangePasswordForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<ChangePasswordFormValues>({
    resolver: typedZodResolver(changePasswordFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      form.reset(defaultValues);
      setSuccess(true);
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setSuccess(false);
    await mutation.mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword });
  }

  return (
    <DsForm onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Trocar senha" description="Informe a senha atual e escolha uma nova.">
        <FormFields.Text form={form} label="Senha atual" name="currentPassword" type="password" />
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Nova senha" name="newPassword" type="password" />
          <FormFields.Text form={form} label="Confirmar nova senha" name="confirmNewPassword" type="password" />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Senha atual incorreta ou erro ao salvar.</FormError>}
      {success && <p className="text-sm text-success">Senha atualizada com sucesso.</p>}

      <FormActions>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Atualizar senha"}
        </Button>
      </FormActions>
    </DsForm>
  );
}
