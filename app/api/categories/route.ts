import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      throw new AppError("Category name is required", 400);
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new AppError("Category already exists", 400);
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
