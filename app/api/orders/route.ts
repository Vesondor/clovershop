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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.customer_order.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          dateTime: "desc",
        },
      }),
      prisma.customer_order.count(),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Server-side validation
    const validation = validateOrderData(body);

    if (!validation.isValid) {
      throw new AppError(
        `Validation failed: ${JSON.stringify(validation.errors)}`,
        400
      );
    }

    const validatedData = validation.validatedData;

    if (validatedData.total < 0.01) {
      throw new AppError("Order total must be at least $0.01", 400);
    }

    // Check for duplicate orders
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const duplicateOrder = await prisma.customer_order.findFirst({
      where: {
        email: validatedData.email,
        total: validatedData.total,
        dateTime: {
          gte: oneMinuteAgo,
        },
      },
    });

    if (duplicateOrder) {
      throw new AppError(
        "Duplicate order detected (same details within 1 minute)",
        409
      );
    }

    const corder = await prisma.customer_order.create({
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
        dateTime: new Date(),
      },
    });

    // Create notification
    if (body.userId || validatedData.email) {
      let userId = body.userId;
      if (!userId) {
        const user = await prisma.user.findUnique({
          where: { email: validatedData.email },
        });
        if (user) userId = user.id;
      }

      if (userId) {
        await createOrderUpdateNotification(
          userId,
          "confirmed",
          corder.id,
          validatedData.total
        );
      }
    }

    return NextResponse.json(
      {
        id: corder.id,
        message: "Order created successfully",
        orderNumber: corder.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return handleError(new AppError("Order conflict", 409));
    }
    return handleError(error);
  }
}
