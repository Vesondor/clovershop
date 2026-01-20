import { NextRequest, NextResponse } from "next/server";
import { uploadToImgBB } from "@/lib/imgbb";
import { AppError } from "@/lib/exceptions";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // Support both 'image' and 'uploadedFile' keys (legacy support)
    const file = (formData.get("image") ||
      formData.get("uploadedFile")) as File | null;

    if (!file) {
      throw new AppError("No file uploaded", 400);
    }

    const imageUrl = await uploadToImgBB(file);

    return NextResponse.json({
      url: imageUrl,
      // Legacy response format support
      fileName: imageUrl,
      success: true,
    });
  } catch (error) {
    return handleError(error);
  }
}
