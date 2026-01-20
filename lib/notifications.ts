import prisma from "@/utils/db";

export async function createOrderUpdateNotification(
  userId: string,
  status: string,
  orderId: string,
  total: number
) {
  try {
    let title = "Order Update";
    let message = `Your order #${orderId.slice(0, 8)} status has been updated.`;
    let type: any = "ORDER_UPDATE"; // Using 'any' to avoid strict enum type matching for now, or import enum from Prisma
    let priority: any = "NORMAL";

    switch (status.toLowerCase()) {
      case "confirmed":
        title = "Order Confirmed";
        message = `Your order #${orderId.slice(
          0,
          8
        )} for $${total} has been confirmed.`;
        priority = "HIGH";
        break;
      case "shipped":
        title = "Order Shipped";
        message = `Your order #${orderId.slice(0, 8)} has been shipped!`;
        priority = "HIGH";
        break;
      case "delivered":
        title = "Order Delivered";
        message = `Your order #${orderId.slice(
          0,
          8
        )} has been delivered. Enjoy!`;
        break;
      case "cancelled":
        title = "Order Cancelled";
        message = `Your order #${orderId.slice(0, 8)} was cancelled.`;
        priority = "HIGH";
        type = "SYSTEM_ALERT";
        break;
    }

    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        priority,
        metadata: { orderId, status },
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    // Silent fail to not block order processing
  }
}
