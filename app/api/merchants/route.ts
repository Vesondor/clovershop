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
    const merchants = await prisma.merchant.findMany();
    return NextResponse.json(merchants);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, description, phone, address } = body;

    if (!name) throw new AppError("Merchant name is required", 400);

    const existing = await prisma.merchant.findFirst({ where: { name } });
    if (existing) throw new AppError("Merchant name already exists", 409);

    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        description,
        phone,
        address,
      },
    });

    return NextResponse.json(merchant, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
