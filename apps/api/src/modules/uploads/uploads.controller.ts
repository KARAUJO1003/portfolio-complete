import type { RequestHandler } from "express";
import { createUpload } from "./uploads.repository";
import { toUploadDto } from "./uploads.mapper";
import { normalizeUploadPath } from "../../shared/storage/normalize-upload-path";
import { ApiError } from "../../shared/errors/api-error";

export const uploadFile: RequestHandler = async (request, response, next) => {
  try {
    if (!request.file) {
      throw new ApiError("File is required", 400);
    }

    const folder = String(request.body.folder || "general");
    const relativePath = normalizeUploadPath({
      folder,
      filename: request.file.filename,
    });

    const upload = await createUpload({
      originalName: request.file.originalname,
      mimeType: request.file.mimetype,
      size: request.file.size,
      path: relativePath,
      createdBy: request.user?.id,
    });

    response.status(201).json({ upload: toUploadDto(upload) });
  } catch (error) {
    next(error);
  }
};
