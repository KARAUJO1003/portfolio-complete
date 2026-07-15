import crypto from "node:crypto";
import { env } from "../../config/env";
import { ApiError } from "../../shared/errors/api-error";
import * as repository from "./project-likes.repository";

export async function likeProject(projectId: string, visitorId: string) {
  if (!visitorId || visitorId.length < 12) {
    throw new ApiError("Invalid visitor id", 400);
  }

  const project = await repository.findPublicProjectById(projectId);
  if (!project) {
    throw new ApiError("Project not found", 404);
  }

  const visitorHash = hashVisitor(visitorId);
  const existingLike = await repository.findLike(projectId, visitorHash);
  let liked = true;

  if (existingLike) {
    await repository.deleteLike(projectId, visitorHash);
    liked = false;
  } else {
    try {
      await repository.createLike(projectId, visitorHash);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        await repository.deleteLike(projectId, visitorHash);
        liked = false;
      } else {
        throw error;
      }
    }
  }

  const likesCount = await repository.countLikes(projectId);
  await repository.syncProjectLikesCount(projectId, likesCount);

  return {
    liked,
    likesCount,
  };
}

function hashVisitor(visitorId: string) {
  return crypto
    .createHmac("sha256", env.jwtSecret)
    .update(visitorId)
    .digest("hex");
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}
