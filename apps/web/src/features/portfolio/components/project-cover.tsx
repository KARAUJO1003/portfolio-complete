import { AsyncImageFrame } from "@/components/ds/async-image-frame";
import { resolveFileUrl } from "@/core/files/file-url";

type ProjectCoverProps = {
  coverPath?: string;
  index: number;
  technologies?: string[];
  title: string;
  variant?: "card" | "drawer";
};

export function ProjectCover({ coverPath, index, technologies = [], title, variant = "card" }: ProjectCoverProps) {
  const coverUrl = resolveFileUrl(coverPath);
  const isDrawer = variant === "drawer";
  const visibleTechnologies = technologies.length ? technologies.slice(0, 3) : ["projeto"];

  return (
    <AsyncImageFrame
      alt={`Preview do projeto ${title}`}
      className={isDrawer ? "aspect-[16/10] bg-black" : "aspect-[1.45] w-full bg-black"}
      decoding="async"
      fallback={<ProjectCoverFallback index={index} title={title} variant={variant} />}
      imageClassName={isDrawer ? "" : "transition-transform duration-500 group-hover:scale-[1.025]"}
      loading="lazy"
      loadingSlot={<ProjectCoverLoading variant={variant} />}
      overlay={isDrawer ? <ProjectCoverOverlay technologies={visibleTechnologies} /> : null}
      sizes={isDrawer ? "(min-width: 1024px) 48vw, 94vw" : "(min-width: 768px) 50vw, 100vw"}
      src={coverUrl}
    />
  );
}

function ProjectCoverLoading({ variant }: { variant: "card" | "drawer" }) {
  return (
    <div
      aria-hidden="true"
      className={
        variant === "drawer"
          ? "absolute inset-0 animate-pulse bg-zinc-900"
          : "absolute inset-0 animate-pulse bg-zinc-900"
      }
    />
  );
}

function ProjectCoverFallback({ index, title, variant }: { index: number; title: string; variant: "card" | "drawer" }) {
  return (
    <div className="flex size-full items-center justify-center bg-zinc-950 p-6 text-white">
      <div className="flex aspect-video w-full max-w-sm flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">projeto 0{index + 1}</span>
        <span className={variant === "drawer" ? "text-3xl font-semibold tracking-[-0.04em]" : "text-lg font-semibold tracking-[-0.03em]"}>
          {title}
        </span>
        <span className="text-[11px] text-white/45">imagem indisponivel</span>
      </div>
    </div>
  );
}

function ProjectCoverOverlay({ technologies }: { technologies: string[] }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/58 to-transparent" />
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <span className="rounded-full border border-white/12 bg-black/42 px-3 py-1 text-[11px] font-medium text-white/82 backdrop-blur-md" key={technology}>
            {technology}
          </span>
        ))}
      </div>
    </>
  );
}
