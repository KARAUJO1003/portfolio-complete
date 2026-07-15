"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectRequestSchema = exports.createProjectRequestSchema = exports.projectSchema = exports.projectVisibilitySchema = exports.publicationStatusSchema = void 0;
const zod_1 = require("zod");
exports.publicationStatusSchema = zod_1.z.enum(["draft", "published", "archived"]);
exports.projectVisibilitySchema = zod_1.z.object({
    portfolio: zod_1.z.boolean().default(true),
    resume: zod_1.z.boolean().default(false),
});
exports.projectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    summary: zod_1.z.string().default(""),
    description: zod_1.z.string().default(""),
    coverPath: zod_1.z.string().default(""),
    demoUrl: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    repoUrl: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    technologies: zod_1.z.array(zod_1.z.string()).default([]),
    featured: zod_1.z.boolean().default(false),
    order: zod_1.z.coerce.number().default(0),
    status: exports.publicationStatusSchema.default("draft"),
    visibility: exports.projectVisibilitySchema.default({
        portfolio: true,
        resume: false,
    }),
});
exports.createProjectRequestSchema = exports.projectSchema;
exports.updateProjectRequestSchema = exports.projectSchema.partial();
