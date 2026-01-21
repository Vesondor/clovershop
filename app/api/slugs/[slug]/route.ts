import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        merchant: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch images manually since there might be no relation in schema or to be safe
    // Based on schema.prisma: model Image { productID String ... }
    const images = await prisma.image.findMany({
      where: { productID: product.id },
    });

    return NextResponse.json({ ...product, images });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
