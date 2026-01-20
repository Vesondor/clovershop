import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  try {
    const { email } = await params;
    if (!email) throw new AppError("Email required", 400);

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) throw new AppError("User not found", 404);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
