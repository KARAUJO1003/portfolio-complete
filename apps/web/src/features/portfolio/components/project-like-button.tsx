"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { likePublicProject } from "@/features/portfolio/api/public-portfolio-api";

const visitorStorageKey = "portfolio.visitorId";
const likedStoragePrefix = "portfolio.projectLiked.";

type ProjectLikeButtonProps = {
  initialLikesCount: number;
  projectId: string;
};

export function ProjectLikeButton({ initialLikesCount, projectId }: ProjectLikeButtonProps) {
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
      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-wait disabled:opacity-80"
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
            className={liked ? "text-rose-500" : "text-muted-foreground"}
            exit={{ opacity: 0, scale: 0.45 }}
            initial={{ opacity: 0, scale: liked ? 0.4 : 0.8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {liked ? "♥" : "♡"}
          </motion.span>
        </AnimatePresence>
      </span>
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
    </motion.button>
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
