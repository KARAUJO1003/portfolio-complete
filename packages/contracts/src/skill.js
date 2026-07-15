"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSkillRequestSchema = exports.createSkillRequestSchema = exports.skillSchema = void 0;
const zod_1 = require("zod");
const project_1 = require("./project");
exports.skillSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    category: zod_1.z.string().default("Geral"),
    startedAt: zod_1.z.string().default(""),
    description: zod_1.z.string().default(""),
    icon: zod_1.z.string().default(""),
    order: zod_1.z.coerce.number().default(0),
    visibility: project_1.projectVisibilitySchema.default({
        portfolio: true,
        resume: true,
    }),
});
exports.createSkillRequestSchema = exports.skillSchema;
exports.updateSkillRequestSchema = exports.skillSchema.partial();
