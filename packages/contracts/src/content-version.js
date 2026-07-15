"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContentVersionRequestSchema = exports.createContentVersionRequestSchema = exports.contentVersionSectionSchema = exports.contentVersionStatusSchema = exports.contentVersionKindSchema = void 0;
const zod_1 = require("zod");
exports.contentVersionKindSchema = zod_1.z.enum(["portfolio", "resume"]);
exports.contentVersionStatusSchema = zod_1.z.enum(["draft", "published", "archived"]);
exports.contentVersionSectionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    enabled: zod_1.z.boolean().default(true),
    order: zod_1.z.number().int().default(0),
    selectionMode: zod_1.z.enum(["all", "selected"]).default("all"),
    itemIds: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.createContentVersionRequestSchema = zod_1.z.object({
    kind: exports.contentVersionKindSchema,
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    template: zod_1.z.string().default("default"),
    sections: zod_1.z.array(exports.contentVersionSectionSchema).default([]),
});
exports.updateContentVersionRequestSchema = exports.createContentVersionRequestSchema
    .omit({ kind: true })
    .partial();
