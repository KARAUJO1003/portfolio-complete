import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

export function typedZodResolver<TValues extends FieldValues>(
  schema: ZodType<TValues, any>,
): Resolver<TValues> {
  return zodResolver(schema) as Resolver<TValues>;
}
