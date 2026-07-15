"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormDescription, FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { saveMyProfile } from "@/features/profile/api/profile-api";
import { myProfileQueryOptions, profileKeys } from "@/features/profile/api/profile-queries";
import { profileFormSchema, type ProfileFormValues } from "@/features/profile/schemas/profile-schema";
import { FileUploadField } from "@/features/uploads/components/file-upload-field";

const defaultValues: ProfileFormValues = {
  name: "",
  headline: "",
  summary: "",
  objective: "",
  location: "",
  address: "",
  birthDate: "",
  driverLicense: "",
  email: "",
  phone: "",
  website: "",
  github: "",
  linkedin: "",
  avatarPath: "",
};

export function ProfileForm() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery(myProfileQueryOptions());

  const form = useForm<ProfileFormValues>({
    resolver: typedZodResolver(profileFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        name: profileQuery.data.name,
        headline: profileQuery.data.headline,
        summary: profileQuery.data.summary,
        objective: profileQuery.data.objective,
        location: profileQuery.data.location,
        address: profileQuery.data.address,
        birthDate: profileQuery.data.birthDate,
        driverLicense: profileQuery.data.driverLicense,
        email: profileQuery.data.email,
        phone: profileQuery.data.phone,
        website: profileQuery.data.website,
        github: profileQuery.data.github,
        linkedin: profileQuery.data.linkedin,
        avatarPath: profileQuery.data.avatarPath,
      });
    }
  }, [profileQuery.data, form]);

  const mutation = useMutation({
    mutationFn: saveMyProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.mine(), profile);
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    await mutation.mutateAsync(values);
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Nome" name="name" form={form} />
        <TextField label="Headline" name="headline" form={form} />
        <TextField label="Email" name="email" form={form} />
        <TextField label="Telefone" name="phone" form={form} />
        <TextField label="Localizacao" name="location" form={form} />
        <TextField label="Endereco" name="address" form={form} />
        <TextField label="Data de nascimento" name="birthDate" form={form} />
        <TextField label="CNH" name="driverLicense" form={form} />
        <FormField>
          <FormLabel htmlFor="avatarPath">Avatar path</FormLabel>
          <div className="flex gap-2">
            <Input className="flex-1" id="avatarPath" {...form.register("avatarPath")} />
            <FileUploadField folder="profile" onUploaded={(path) => form.setValue("avatarPath", path, { shouldDirty: true })} />
          </div>
        </FormField>
        <TextField label="Website" name="website" form={form} />
        <TextField label="GitHub" name="github" form={form} />
        <TextField label="LinkedIn" name="linkedin" form={form} />
      </div>

      <FormField>
        <FormLabel htmlFor="summary">Resumo</FormLabel>
        <Textarea id="summary" {...form.register("summary")} />
        <FormDescription>Use **texto** para destacar trechos em negrito no curriculo.</FormDescription>
        {form.formState.errors.summary?.message && (
          <FormError>{form.formState.errors.summary.message}</FormError>
        )}
      </FormField>

      <FormField>
        <FormLabel htmlFor="objective">Objetivo</FormLabel>
        <Textarea id="objective" {...form.register("objective")} />
        <FormDescription>Use **texto** para destacar trechos em negrito no curriculo.</FormDescription>
        {form.formState.errors.objective?.message && (
          <FormError>{form.formState.errors.objective.message}</FormError>
        )}
      </FormField>

      {mutation.isError && <FormError>Erro ao salvar perfil.</FormError>}

      <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Salvar perfil"}
      </Button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: keyof ProfileFormValues;
  form: ReturnType<typeof useForm<ProfileFormValues>>;
};

function TextField({ label, name, form }: TextFieldProps) {
  const error = form.formState.errors[name]?.message;

  return (
    <FormField>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} {...form.register(name)} />
      {error && <FormError>{String(error)}</FormError>}
    </FormField>
  );
}
