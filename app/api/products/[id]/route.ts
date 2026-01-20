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
    if (!id) throw new AppError("Product ID is required", 400);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new AppError("Product not found", 404);

    return NextResponse.json(product);
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
    const body = await req.json();
    const {
      merchantId,
      slug,
      title,
      mainImage,
      price,
      rating,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) throw new AppError("Product not found", 404);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        merchantId,
        title,
        mainImage,
        slug,
        price,
        rating,
        description,
        manufacturer,
        categoryId,
        inStock,
      },
    });

    return NextResponse.json(updatedProduct);
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

    // Check for related orders
    const relatedOrderProductItems =
      await prisma.customer_order_product.findMany({
        where: { productId: id },
      });

    if (relatedOrderProductItems.length > 0) {
      throw new AppError(
        "Cannot delete product because of foreign key constraint",
        400,
      );
    }

    await prisma.product.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
