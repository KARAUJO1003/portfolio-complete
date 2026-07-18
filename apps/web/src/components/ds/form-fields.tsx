"use client";

import { Controller, type FieldValues, type Path, type PathValue, type UseFormReturn } from "react-hook-form";
import { FormDescription, FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { RichTextEditor } from "@/components/ds/rich-text-editor";
import { Input } from "@/components/ui/input";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Select as SelectRoot, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch as SwitchPrimitive } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type BaseFieldProps<TValues extends FieldValues> = {
  className?: string;
  description?: string;
  form: UseFormReturn<TValues>;
  label: string;
  name: Path<TValues>;
};

function fieldError<TValues extends FieldValues>(form: UseFormReturn<TValues>, name: Path<TValues>) {
  const error = form.formState.errors[name];
  return typeof error?.message === "string" ? error.message : null;
}

function Text<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
  type = "text",
}: BaseFieldProps<TValues> & { type?: React.HTMLInputTypeAttribute }) {
  const error = fieldError(form, name);

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} type={type} {...form.register(name)} />
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormError>{error}</FormError>}
    </FormField>
  );
}

function NumberStepper<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
  step = 1,
}: BaseFieldProps<TValues> & { step?: number }) {
  const error = fieldError(form, name);
  const value = Number(form.watch(name) || 0);

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <NumberField
        id={name}
        step={step}
        value={value}
        onValueChange={(next) =>
          form.setValue(name, (next ?? 0) as PathValue<TValues, typeof name>, { shouldDirty: true, shouldValidate: true })
        }
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormError>{error}</FormError>}
    </FormField>
  );
}

function TextareaField<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
  rows = 5,
}: BaseFieldProps<TValues> & { rows?: number }) {
  const error = fieldError(form, name);

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea id={name} rows={rows} {...form.register(name)} />
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormError>{error}</FormError>}
    </FormField>
  );
}

function Select<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
  options,
}: BaseFieldProps<TValues> & { options: Array<{ label: string; value: string }> }) {
  const error = fieldError(form, name);
  const value = String(form.watch(name) ?? "");
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <SelectRoot
        value={value}
        onValueChange={(next) =>
          form.setValue(name, next as PathValue<TValues, typeof name>, { shouldDirty: true, shouldValidate: true })
        }
      >
        <SelectTrigger id={name}>
          <SelectValue>{() => selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectPopup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </SelectRoot>
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormError>{error}</FormError>}
    </FormField>
  );
}

function Switch<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
}: BaseFieldProps<TValues>) {
  const checked = Boolean(form.watch(name));

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-surface-muted/50 p-3 text-sm",
        className,
      )}
    >
      <span>
        <span className="block font-medium">{label}</span>
        {description && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>}
      </span>
      <input className="sr-only" type="checkbox" {...form.register(name)} />
      <span
        className={cn(
          "relative mt-0.5 h-6 w-10 rounded-full border border-border bg-muted transition-colors",
          checked && "border-primary/50 bg-primary",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
    </label>
  );
}

function TagInput<TValues extends FieldValues>(props: BaseFieldProps<TValues>) {
  return (
    <Text
      {...props}
      description={props.description ?? "Separe os valores por virgula. Um seletor com autocomplete entra na proxima fase."}
    />
  );
}

function RichTextField<TValues extends FieldValues>(props: BaseFieldProps<TValues> & { rows?: number }) {
  return (
    <TextareaField
      {...props}
      description={props.description ?? "HTML string sera o formato persistido; Markdown importado sera convertido em fase futura."}
      rows={props.rows ?? 7}
    />
  );
}

function HtmlEditor<TValues extends FieldValues>({
  className,
  description,
  form,
  label,
  name,
}: BaseFieldProps<TValues>) {
  const error = fieldError(form, name);

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <RichTextEditor id={name} value={field.value ?? ""} onChange={field.onChange} />
        )}
      />
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormError>{error}</FormError>}
    </FormField>
  );
}

export const FormFields = {
  HtmlEditor,
  NumberStepper,
  RichTextField,
  Select,
  Switch,
  TagInput,
  Text,
  Textarea: TextareaField,
};
