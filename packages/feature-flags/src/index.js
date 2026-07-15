"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_FLAGS = void 0;
exports.isFeatureEnabled = isFeatureEnabled;
exports.FEATURE_FLAGS = {
    auth: {
        enabled: false,
    },
    portfolio: {
        versions: {
            enabled: true,
        },
    },
    resume: {
        versions: {
            enabled: true,
        },
        pdf: {
            enabled: true,
            templates: true,
        },
    },
    uploads: {
        local: {
            enabled: true,
        },
    },
    anonymousLikes: {
        enabled: true,
    },
    github: {
        integration: {
            enabled: true,
        },
        stats: {
            enabled: true,
        },
    },
    i18n: {
        ready: false,
    },
};
function getByDotPath(obj, key) {
    return key.split(".").reduce((acc, part) => {
        if (!acc || typeof acc !== "object")
            return undefined;
        return acc[part];
    }, obj);
}
function isFeatureEnabled(key, defaultValue = false) {
    const value = getByDotPath(exports.FEATURE_FLAGS, key);
    return typeof value === "boolean" ? value : defaultValue;
}
