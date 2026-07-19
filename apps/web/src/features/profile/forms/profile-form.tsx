"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DsForm, FormActions, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { GithubIcon, LinkedInIcon } from "@/components/ds/brand-icons";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
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
    <DsForm onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Dados pessoais" description="Identificação, contato e localização exibidos no portfolio e no currículo.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Nome" name="name" />
          <FormFields.Text form={form} label="Headline" name="headline" />
          <FormFields.Text form={form} label="Email" name="email" />
          <FormFields.Text form={form} label="Telefone" name="phone" />
          <FormFields.Text form={form} label="Localização" name="location" />
          <FormFields.Text form={form} label="Endereço" name="address" />
          <FormFields.Text form={form} label="Data de nascimento" name="birthDate" />
          <FormFields.Text form={form} label="CNH" name="driverLicense" />
        </div>

        <FormField>
          <FormLabel htmlFor="avatarPath">Avatar</FormLabel>
          <div className="flex gap-2">
            <Input className="flex-1" id="avatarPath" {...form.register("avatarPath")} />
            <FileUploadField folder="profile" onUploaded={(path) => form.setValue("avatarPath", path, { shouldDirty: true })} />
          </div>
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.UrlField form={form} icon={GlobeIcon} label="Website" name="website" />
          <FormFields.UrlField form={form} icon={GithubIcon} label="GitHub" name="github" />
          <FormFields.UrlField form={form} icon={LinkedInIcon} label="LinkedIn" name="linkedin" />
        </div>
      </FormSection>

      <FormSection title="Resumo e objetivo" description="Textos usados no currículo (PDF entende negrito, listas, títulos e citações).">
        <FormFields.HtmlEditor form={form} label="Resumo" name="summary" />
        <FormFields.HtmlEditor form={form} label="Objetivo" name="objective" />
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar perfil.</FormError>}

      <FormActions>
        <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar perfil"}
        </Button>
      </FormActions>
    </DsForm>
  );
}
