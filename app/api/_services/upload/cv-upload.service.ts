import { randomUUID } from "crypto";

import { createServiceClient } from "@/app/api/_supabase/service-role";
import { hasSupabaseServiceRoleEnv } from "@/app/api/_supabase/env";

const ALLOWED_CV_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_CV_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export function getMaxCvUploadSizeBytes() {
  const parsedSize = Number(process.env.MAX_CV_UPLOAD_SIZE_MB ?? 5);
  const sizeInMb = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : 5;
  return sizeInMb * 1024 * 1024;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function hasAllowedSignature(extension: string, bytes: Uint8Array) {
  if (extension === "pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }

  if (extension === "doc") {
    return (
      bytes[0] === 0xd0 &&
      bytes[1] === 0xcf &&
      bytes[2] === 0x11 &&
      bytes[3] === 0xe0 &&
      bytes[4] === 0xa1 &&
      bytes[5] === 0xb1 &&
      bytes[6] === 0x1a &&
      bytes[7] === 0xe1
    );
  }

  if (extension === "docx") {
    return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  }

  return false;
}

export async function validateCvFile(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("CV is required");
  }

  const extension = getFileExtension(file.name);

  if (!ALLOWED_CV_EXTENSIONS.has(extension)) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed");
  }

  if (!ALLOWED_CV_MIME_TYPES.has(file.type)) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed");
  }

  if (file.size > getMaxCvUploadSizeBytes()) {
    throw new Error(`CV must be ${process.env.MAX_CV_UPLOAD_SIZE_MB ?? 5}MB or smaller`);
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (!hasAllowedSignature(extension, bytes)) {
    throw new Error("The uploaded CV file could not be verified");
  }

  return {
    extension,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export async function uploadCvFile(file: File, applicationIdSeed = randomUUID()) {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("CV upload is not configured");
  }

  const validation = await validateCvFile(file);
  const bucket = process.env.SUPABASE_CV_BUCKET ?? "cvs";
  const storagePath = `applications/${applicationIdSeed}/${randomUUID()}.${validation.extension}`;
  const supabase = createServiceClient();

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: validation.mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error("CV upload failed");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    cvUrl: data.publicUrl,
    cvFileName: validation.fileName,
    storagePath,
  };
}

async function validateDocumentFile(file: File, label: string) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`${label} is required`);
  }

  const extension = getFileExtension(file.name);

  if (!ALLOWED_CV_EXTENSIONS.has(extension) || !ALLOWED_CV_MIME_TYPES.has(file.type)) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed");
  }

  if (file.size > getMaxCvUploadSizeBytes()) {
    throw new Error(`${label} must be ${process.env.MAX_CV_UPLOAD_SIZE_MB ?? 5}MB or smaller`);
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (!hasAllowedSignature(extension, bytes)) {
    throw new Error(`The uploaded ${label} file could not be verified`);
  }

  return { extension, fileName: file.name, mimeType: file.type };
}

export async function uploadCoverLetterFile(file: File, applicationIdSeed = randomUUID()) {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("Cover letter upload is not configured");
  }

  const validation = await validateDocumentFile(file, "Cover letter");
  const bucket = process.env.SUPABASE_CV_BUCKET ?? "cvs";
  const storagePath = `applications/${applicationIdSeed}/cover-letter-${randomUUID()}.${validation.extension}`;
  const supabase = createServiceClient();

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: validation.mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error("Cover letter upload failed");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    coverLetterUrl: data.publicUrl,
    coverLetterFileName: validation.fileName,
    storagePath,
  };
}
