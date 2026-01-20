import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerOrderId, productId, quantity } = body;

    if (!customerOrderId)
      throw new AppError("Customer order ID is required", 400);
    if (!productId) throw new AppError("Product ID is required", 400);
    if (!quantity || quantity <= 0)
      throw new AppError("Valid quantity is required", 400);

    const existingOrder = await prisma.customer_order.findUnique({
      where: { id: customerOrderId },
    });
    if (!existingOrder) throw new AppError("Customer order not found", 404);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) throw new AppError("Product not found", 404);

    const orderProduct = await prisma.customer_order_product.create({
      data: {
        customerOrderId,
        productId,
        quantity: Number(quantity),
      },
    });

    return NextResponse.json(orderProduct, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const productOrders = await prisma.customer_order_product.findMany({
      select: {
        productId: true,
        quantity: true,
        customerOrder: {
          select: {
            id: true,
            name: true,
            lastname: true,
            phone: true,
            email: true,
            company: true,
            adress: true,
            apartment: true,
            postalCode: true,
            dateTime: true,
            status: true,
            total: true,
          },
        },
      },
    });

    const ordersMap = new Map();

    for (const order of productOrders) {
      const { customerOrder, productId, quantity } = order;
      // @ts-ignore
      const { id, ...orderDetails } = customerOrder;

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          title: true,
          mainImage: true,
          price: true,
          slug: true,
        },
      });

      if (ordersMap.has(id)) {
        ordersMap.get(id).products.push({ ...product, quantity });
      } else {
        ordersMap.set(id, {
          customerOrderId: id,
          customerOrder: orderDetails,
          products: [{ ...product, quantity }],
        });
      }
    }

    const groupedOrders = Array.from(ordersMap.values());
    return NextResponse.json(groupedOrders);
  } catch (error) {
    return handleError(error);
  }
}
