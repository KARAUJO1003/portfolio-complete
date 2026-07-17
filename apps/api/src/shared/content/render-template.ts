type TemplateProfile = {
  name?: string;
  headline?: string;
  email?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
};

type TemplateContext = {
  profile?: TemplateProfile | null;
};

const VARIABLE_PATTERN = /\{([a-zA-Z0-9_.]+)\}/g;

export function renderTemplateVariables(html: string, context: TemplateContext) {
  return html.replace(VARIABLE_PATTERN, (match, key: string) => resolveVariable(key, context) ?? match);
}

function resolveVariable(key: string, context: TemplateContext): string | null {
  if (key === "year") return String(new Date().getFullYear());

  if (key.startsWith("profile.")) {
    const field = key.slice("profile.".length) as keyof TemplateProfile;
    const value = context.profile?.[field];
    return value || null;
  }

  return null;
}
