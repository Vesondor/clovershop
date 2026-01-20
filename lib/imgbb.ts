import { AppError } from "@/lib/exceptions"; // You'll need to create this or import from where you define AppError

export async function uploadToImgBB(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  // Use the API key from environment variables
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not defined");
  }

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }

    return data.data.url;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw new Error("Image upload failed");
  }
}
