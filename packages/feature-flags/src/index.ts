export const FEATURE_FLAGS = {
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
} as const;

function getByDotPath(obj: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

export function isFeatureEnabled(key: string, defaultValue = false): boolean {
  const value = getByDotPath(FEATURE_FLAGS, key);
  return typeof value === "boolean" ? value : defaultValue;
}
