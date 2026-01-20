import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) throw new AppError("Category ID is required", 400);

    await prisma.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if ID is provided
    if (!id) {
      throw new AppError("Category ID is required", 400);
    }

    const body = await req.json();
    const { name } = body;

    if (!name) throw new AppError("Category name is required", 400);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return handleError(error);
  }
}
