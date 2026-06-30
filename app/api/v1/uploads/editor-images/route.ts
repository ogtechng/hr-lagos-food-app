import { requireAdmin } from "@/app/api/_auth/require-admin";
import { uploadEditorImageFile } from "@/app/api/_services/upload/editor-image-upload.service";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const image = formData.get("image");
    const folder = formData.get("folder");

    if (!(image instanceof File) || image.size === 0) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    return Response.json(
      {
        data: await uploadEditorImageFile(
          image,
          typeof folder === "string" ? folder : undefined,
        ),
      },
      { status: 201 },
    );
  } catch (error) {
    const safeMessages = new Set([
      "Image is required",
      "Image upload is not configured",
      "Image upload failed",
      "Only PNG, JPG, WebP, and GIF images are allowed",
      "The uploaded image file could not be verified",
    ]);

    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (error instanceof Error && error.message.startsWith("Image must be")) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && safeMessages.has(error.message)) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
