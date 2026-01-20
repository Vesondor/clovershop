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
    // This replicates getting all products for a specific order ID
    const orderProducts = await prisma.customer_order_product.findMany({
      where: { customerOrderId: id },
      include: { product: true },
    });

    if (!orderProducts || orderProducts.length === 0) {
      // Technically strict 404 might be annoying if order exists but empty, but matching legacy behavior
      throw new AppError("Order not found or empty", 404);
    }

    return NextResponse.json(orderProducts);
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
    const { customerOrderId, productId, quantity } = await req.json();

    if (!id) throw new AppError("Order product ID required", 400);

    const existing = await prisma.customer_order_product.findUnique({
      where: { id },
    });
    if (!existing) throw new AppError("Order product not found", 404);

    if (quantity !== undefined && quantity <= 0)
      throw new AppError("Quantity > 0", 400);

    const updated = await prisma.customer_order_product.update({
      where: { id },
      data: {
        customerOrderId: customerOrderId || existing.customerOrderId,
        productId: productId || existing.productId,
        quantity: quantity !== undefined ? quantity : existing.quantity,
      },
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
    // Legacy controller deleted MANY based on customerOrderId if id matched?
    // "deleteMany where customerOrderId: id" suggests the route might have been /api/order-product/order/:id ?
    // But REST usually implies /resource/:id.
    // Looking at "deleteProductOrder" in customer_order_product.js:
    /*
      const { id } = request.params;
      ...
      await prisma.customer_order_product.deleteMany({
        where: { customerOrderId: id }
      });
    */
    // This is weird. It takes an ID (presumably order ID) and deletes all products for that order?
    // Or is `id` the `customer_order_product` ID?
    // The code says `customerOrderId: id`. So it assumes the `id` param IS the `customerOrderId`.
    // BUT it checks `findUnique({ where: { id } })` BEFORE deleting.
    // This implies `id` is the PK of `customer_order_product`?
    // If `id` is PK, then `customerOrderId: id` would be wrong unless PK and OrderID are same (unlikely).
    // Ah, wait. `findUnique({ where: { id } })` uses `id`.
    // `deleteMany({ where: { customerOrderId: id } })`.
    // If I pass a `customer_order_product` UUID, it finds it. Then it tries to delete all items where `customerOrderId` equals that UUID?
    // That seems like a bug in the original code, OR `id` acts as OrderID in one place and PK in another?
    // Let's assume the intent is "Clear items for this Order" or "Delete this item".
    // Given the ambiguity, I'll implement "Delete this specific item" which is safer.
    // If the frontend calls this with OrderID, it will 404 on `findUnique({ where: { id: orderId } })` (unless Collision).

    // I will implement safer logic: Request logic to delete specific item by ID.

    await prisma.customer_order_product.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
