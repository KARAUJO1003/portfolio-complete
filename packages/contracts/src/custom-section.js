"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomSectionRequestSchema = exports.createCustomSectionRequestSchema = exports.customSectionSchema = void 0;
const zod_1 = require("zod");
const project_1 = require("./project");
exports.customSectionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    key: zod_1.z.string().min(1),
    content: zod_1.z.string().default(""),
    order: zod_1.z.coerce.number().default(0),
    status: project_1.publicationStatusSchema.default("draft"),
    visibility: project_1.projectVisibilitySchema.default({ portfolio: true, resume: false }),
});
exports.createCustomSectionRequestSchema = exports.customSectionSchema;
exports.updateCustomSectionRequestSchema = exports.customSectionSchema.partial();
