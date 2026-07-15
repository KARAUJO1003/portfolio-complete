"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomPageRequestSchema = exports.createCustomPageRequestSchema = exports.customPageSchema = void 0;
const zod_1 = require("zod");
const project_1 = require("./project");
exports.customPageSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().default(""),
    content: zod_1.z.string().default(""),
    status: project_1.publicationStatusSchema.default("draft"),
    order: zod_1.z.coerce.number().default(0),
    showInNavigation: zod_1.z.boolean().default(false),
});
exports.createCustomPageRequestSchema = exports.customPageSchema;
exports.updateCustomPageRequestSchema = exports.customPageSchema.partial();
