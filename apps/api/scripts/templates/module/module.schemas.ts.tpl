import { z } from "zod";
export const {{CAMEL}}Schema = z.object({
{{FIELDS_ZOD}}
});
export const update{{PASCAL}}Schema = {{CAMEL}}Schema.partial();
