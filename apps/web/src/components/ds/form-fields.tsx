"use client";

import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { FormDescription, FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const rawValue = form.watch(name);
  const value = Number(rawValue || 0);

  function setNext(next: number) {
    form.setValue(name, next as PathValue<TValues, typeof name>, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <div className="grid grid-cols-[40px_1fr_40px] overflow-hidden rounded-md border border-input bg-background">
        <button
          className="border-r border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          type="button"
          onClick={() => setNext(value - step)}
        >
          -
        </button>
        <Input
          id={name}
          className="rounded-none border-0 text-center shadow-none focus-visible:ring-0"
          type="number"
          {...form.register(name)}
        />
        <button
          className="border-l border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          type="button"
          onClick={() => setNext(value + step)}
        >
          +
        </button>
      </div>
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

  return (
    <FormField className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <select
        id={name}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
        {...form.register(name)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export const FormFields = {
  NumberStepper,
  RichTextField,
  Select,
  Switch,
  TagInput,
  Text,
  Textarea: TextareaField,
};
