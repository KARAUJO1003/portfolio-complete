"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { likePublicProject } from "@/features/portfolio/api/public-portfolio-api";

const visitorStorageKey = "portfolio.visitorId";
const likedStoragePrefix = "portfolio.projectLiked.";

type ProjectLikeButtonProps = {
  compact?: boolean;
  initialLikesCount: number;
  projectId: string;
};

export function ProjectLikeButton({ compact = false, initialLikesCount, projectId }: ProjectLikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLiked(isProjectLiked(projectId));
  }, [projectId]);

  const label = useMemo(() => (liked ? "Descurtir projeto" : "Curtir projeto"), [liked]);

  async function handleToggleLike() {
    if (isPending) return;

    const previousLiked = liked;
    const previousLikesCount = likesCount;
    const optimisticLiked = !previousLiked;

    setIsPending(true);
    setLiked(optimisticLiked);
    setLikesCount((current) => Math.max(0, current + (optimisticLiked ? 1 : -1)));
    setProjectLiked(projectId, optimisticLiked);

    try {
      const result = await likePublicProject(projectId, getOrCreateVisitorId());
      setLiked(result.liked);
      setLikesCount(result.likesCount);
      setProjectLiked(projectId, result.liked);
    } catch {
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
      setProjectLiked(projectId, previousLiked);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <motion.button
      aria-label={label}
      aria-pressed={liked}
      className={
        compact
          ? "inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/45 text-xs text-white shadow-sm backdrop-blur-md transition-colors hover:bg-black/70 disabled:cursor-wait disabled:opacity-80"
          : "inline-flex min-h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-wait disabled:opacity-80"
      }
      disabled={isPending}
      title={label}
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={handleToggleLike}
    >
      <span className="relative flex size-4 items-center justify-center">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={liked ? "liked" : "idle"}
            animate={{ opacity: 1, scale: 1 }}
            className={liked ? "text-rose-500" : compact ? "text-white" : "text-muted-foreground"}
            exit={{ opacity: 0, scale: 0.45 }}
            initial={{ opacity: 0, scale: liked ? 0.4 : 0.8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <HeartIcon filled={liked} />
          </motion.span>
        </AnimatePresence>
      </span>
      {compact ? null : (
        <>
          <span>{liked ? "Curtido" : "Curtir"}</span>
          <motion.span
            key={likesCount}
            animate={{ opacity: 1, y: 0 }}
            className="rounded bg-muted px-1.5 py-0.5"
            initial={{ opacity: 0, y: liked ? -4 : 4 }}
            transition={{ duration: 0.16 }}
          >
            {likesCount}
          </motion.span>
        </>
      )}
    </motion.button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" className="size-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24">
      <path
        d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.8 4.7 0 6.5L12 20l8.8-8.9c1.8-1.8 1.8-4.7 0-6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getOrCreateVisitorId() {
  const current = window.localStorage.getItem(visitorStorageKey);
  if (current) {
    return current;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(visitorStorageKey, next);
  return next;
}

function isProjectLiked(projectId: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(`${likedStoragePrefix}${projectId}`) === "true";
}

function setProjectLiked(projectId: string, liked: boolean) {
  if (liked) {
    window.localStorage.setItem(`${likedStoragePrefix}${projectId}`, "true");
    return;
  }

  window.localStorage.removeItem(`${likedStoragePrefix}${projectId}`);
}
