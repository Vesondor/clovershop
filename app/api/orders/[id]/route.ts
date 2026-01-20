import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";
import { validateOrderData } from "@/lib/validation";
import { createOrderUpdateNotification } from "@/lib/notifications";

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
    if (!id) throw new AppError("Order ID required", 400);

    const order = await prisma.customer_order.findUnique({
      where: { id },
    });

    if (!order) throw new AppError("Order not found", 404);

    return NextResponse.json(order);
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

    const validation = validateOrderData(body);
    if (!validation.isValid) throw new AppError("Validation failed", 400);

    const validatedData = validation.validatedData;

    const existingOrder = await prisma.customer_order.findUnique({
      where: { id },
    });
    if (!existingOrder) throw new AppError("Order not found", 404);

    const updatedOrder = await prisma.customer_order.update({
      where: { id },
      data: {
        name: validatedData.name,
        lastname: validatedData.lastname,
        phone: validatedData.phone,
        email: validatedData.email,
        company: validatedData.company,
        adress: validatedData.adress,
        apartment: validatedData.apartment,
        postalCode: validatedData.postalCode,
        status: validatedData.status,
        city: validatedData.city,
        country: validatedData.country,
        orderNotice: validatedData.orderNotice,
        total: validatedData.total,
      },
    });

    if (existingOrder.status !== validatedData.status) {
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (user) {
        await createOrderUpdateNotification(
          user.id,
          validatedData.status,
          updatedOrder.id,
          validatedData.total,
        );
      }
    }

    return NextResponse.json(updatedOrder);
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
    await prisma.customer_order.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
