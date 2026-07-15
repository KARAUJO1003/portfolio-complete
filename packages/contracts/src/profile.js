"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProfileRequestSchema = exports.profileSchema = void 0;
const zod_1 = require("zod");
exports.profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    headline: zod_1.z.string().default(""),
    summary: zod_1.z.string().default(""),
    objective: zod_1.z.string().default(""),
    location: zod_1.z.string().default(""),
    address: zod_1.z.string().default(""),
    birthDate: zod_1.z.string().default(""),
    driverLicense: zod_1.z.string().default(""),
    email: zod_1.z.string().email().or(zod_1.z.literal("")).default(""),
    phone: zod_1.z.string().default(""),
    website: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    github: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    linkedin: zod_1.z.string().url().or(zod_1.z.literal("")).default(""),
    avatarPath: zod_1.z.string().default(""),
});
exports.upsertProfileRequestSchema = exports.profileSchema;
