import { randomUUID } from "crypto";

import { hasSupabaseServiceRoleEnv } from "@/app/api/_supabase/env";
import { createServiceClient } from "@/app/api/_supabase/service-role";

const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getMaxEditorImageUploadSizeBytes() {
  const parsedSize = Number(process.env.MAX_EDITOR_IMAGE_UPLOAD_SIZE_MB ?? 4);
  const sizeInMb = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : 4;
  return sizeInMb * 1024 * 1024;
}

function hasAllowedImageSignature(extension: string, bytes: Uint8Array) {
  if (extension === "png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (extension === "webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }

  if (extension === "gif") {
    return (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    );
  }

  return false;
}

async function validateEditorImageFile(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Image is required");
  }

  const extension = getFileExtension(file.name);

  if (!ALLOWED_IMAGE_EXTENSIONS.has(extension) || !ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error("Only PNG, JPG, WebP, and GIF images are allowed");
  }

  if (file.size > getMaxEditorImageUploadSizeBytes()) {
    throw new Error(
      `Image must be ${process.env.MAX_EDITOR_IMAGE_UPLOAD_SIZE_MB ?? 4}MB or smaller`,
    );
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (!hasAllowedImageSignature(extension, bytes)) {
    throw new Error("The uploaded image file could not be verified");
  }

  return {
    extension,
    fileName: file.name,
    mimeType: file.type,
  };
}

const ALLOWED_IMAGE_FOLDERS = new Set(["jobs", "entities"]);

export async function uploadEditorImageFile(file: File, folder = "jobs") {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("Image upload is not configured");
  }

  const validation = await validateEditorImageFile(file);
  const bucket = process.env.SUPABASE_EDITOR_IMAGES_BUCKET ?? "editor-images";
  const safeFolder = ALLOWED_IMAGE_FOLDERS.has(folder) ? folder : "jobs";
  const storagePath = `${safeFolder}/${randomUUID()}.${validation.extension}`;
  const supabase = createServiceClient();

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: validation.mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error("Image upload failed");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    url: data.publicUrl,
    fileName: validation.fileName,
    storagePath,
  };
}
