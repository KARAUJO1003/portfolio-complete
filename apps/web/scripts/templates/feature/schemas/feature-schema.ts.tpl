import { z } from "zod";
export const {{CAMEL}}Schema = z.object({
{{FIELDS_ZOD}}
});
export type {{PASCAL}}FormValues = z.infer<typeof {{CAMEL}}Schema>;
export const {{CAMEL}}Defaults: {{PASCAL}}FormValues = {
{{DEFAULT_VALUES}}
};
