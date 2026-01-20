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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) throw new AppError("ID required", 400);

    const merchant = await prisma.merchant.findUnique({ where: { id } });
    if (!merchant) throw new AppError("Merchant not found", 404);

    return NextResponse.json(merchant);
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
    const { name, email, description, phone, address, status } =
      await req.json();

    if (!id) throw new AppError("ID required", 400);

    const existing = await prisma.merchant.findUnique({ where: { id } });
    if (!existing) throw new AppError("Merchant not found", 404);

    const updated = await prisma.merchant.update({
      where: { id },
      data: { name, email, description, phone, address, status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.merchant.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
