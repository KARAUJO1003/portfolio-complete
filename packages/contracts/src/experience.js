"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExperienceRequestSchema = exports.createExperienceRequestSchema = exports.experienceSchema = exports.experienceTypeSchema = void 0;
const zod_1 = require("zod");
const project_1 = require("./project");
exports.experienceTypeSchema = zod_1.z.enum([
    "work",
    "education",
    "certification",
    "link",
]);
exports.experienceSchema = zod_1.z.object({
    type: exports.experienceTypeSchema.default("work"),
    title: zod_1.z.string().min(1),
    organization: zod_1.z.string().default(""),
    location: zod_1.z.string().default(""),
    startDate: zod_1.z.string().default(""),
    endDate: zod_1.z.string().default(""),
    current: zod_1.z.boolean().default(false),
    description: zod_1.z.string().default(""),
    url: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    order: zod_1.z.coerce.number().default(0),
    visibility: project_1.projectVisibilitySchema.default({
        portfolio: false,
        resume: true,
    }),
});
exports.createExperienceRequestSchema = exports.experienceSchema;
exports.updateExperienceRequestSchema = exports.experienceSchema.partial();
