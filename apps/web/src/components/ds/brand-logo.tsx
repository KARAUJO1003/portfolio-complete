import { cn } from "@/lib/utils";
import Image from "next/image";

const skillLogos: Record<string, { adaptive?: boolean; color: string; label: string; slug: string }> = {
  figma: { color: "f24e1e", label: "Figma", slug: "figma" },
  git: { color: "f05032", label: "Git", slug: "git" },
  github: { adaptive: true, color: "18181b", label: "GitHub", slug: "github" },
  mongodb: { color: "47a248", label: "MongoDB", slug: "mongodb" },
  next: { adaptive: true, color: "18181b", label: "Next.js", slug: "nextdotjs" },
  "next.js": { adaptive: true, color: "18181b", label: "Next.js", slug: "nextdotjs" },
  node: { color: "5fa04e", label: "Node.js", slug: "nodedotjs" },
  "node js": { color: "5fa04e", label: "Node.js", slug: "nodedotjs" },
  postgresql: { color: "4169e1", label: "PostgreSQL", slug: "postgresql" },
  prisma: { adaptive: true, color: "18181b", label: "Prisma", slug: "prisma" },
  react: { color: "61dafb", label: "React", slug: "react" },
  "react hook form": { color: "ec5990", label: "React Hook Form", slug: "reacthookform" },
  shadcn: { adaptive: true, color: "18181b", label: "shadcn/ui", slug: "shadcnui" },
  tailwind: { color: "06b6d4", label: "Tailwind CSS", slug: "tailwindcss" },
  typescript: { color: "3178c6", label: "TypeScript", slug: "typescript" },
  zod: { color: "3e67b1", label: "Zod", slug: "zod" },
};

type BrandLogoProps = {
  className?: string;
  name: string;
};

export function BrandLogo({ className, name }: BrandLogoProps) {
  const logo = getSkillLogo(name);

  if (!logo) {
    return (
      <span className={cn("grid size-5 place-items-center rounded-full bg-primary-accent/12 text-[10px] font-semibold text-primary-accent", className)}>
        {name.trim().slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={cn("grid size-5 place-items-center rounded-full bg-white/[0.04]", className)}>
      <Image
        alt=""
        aria-hidden="true"
        className={cn("size-3.5", logo.adaptive && "brand-logo-adaptive")}
        height={14}
        loading="lazy"
        src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color}`}
        unoptimized
        width={14}
      />
    </span>
  );
}

function getSkillLogo(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9. ]/g, "").trim();

  return Object.entries(skillLogos).find(([key]) => normalized.includes(key))?.[1];
}
