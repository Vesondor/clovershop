import prisma from "@/utils/db";
import { parse } from "csv-parse/sync";
import { AppError } from "@/lib/exceptions";

// Helper for row validation
export function validateRow(row: any) {
  const errors: string[] = [];
  const startData = { ...row };

  // Validate required fields
  if (!startData.title) errors.push("Title is required");
  if (!startData.price) errors.push("Price is required");
  if (!startData.categoryId) errors.push("Category ID is required");

  // Validate numeric fields
  if (startData.price && isNaN(parseFloat(startData.price))) {
    errors.push("Price must be a number");
  }
  if (startData.inStock && isNaN(parseInt(startData.inStock))) {
    errors.push("inStock must be a number");
  }

  return {
    ok: errors.length === 0,
    data: startData,
    error: errors.length > 0 ? errors.join(", ") : null,
  };
}

// Helper to parse CSV buffer
export async function parseCsvBufferToRows(buffer: Buffer): Promise<any[]> {
  try {
    const content = buffer.toString("utf-8");
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records;
  } catch (error) {
    console.error("CSV Parse Error:", error);
    throw new AppError("Failed to parse CSV file", 400);
  }
}

export async function createBatchWithItems(
  tx: any,
  batchId: string,
  validRows: any[],
  errorRows: any[]
) {
  let successCount = 0;
  let itemsToCreate = [];

  // Prepare valid items
  for (const row of validRows) {
    itemsToCreate.push({
      batchId,
      title: row.title,
      slug: row.slug || row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: parseFloat(row.price),
      manufacturer: row.manufacturer || "",
      description: row.description || "",
      mainImage: row.mainImage || "",
      categoryId: row.categoryId,
      inStock: parseInt(row.inStock || "0"),
      status: "CREATED",
      error: null,
    });
    successCount++;
  }

  // Prepare error items
  for (const errRow of errorRows) {
    // We map error rows (which might be just {index, error})
    // Ideally we want the data too but the controller logic passed "errors" as {index, error}
    // Let's assume we don't store the bad data in DB for now to simplify,
    // or we store what we can. The schema allows nullable fields.
    itemsToCreate.push({
      batchId,
      title: "INVALID ROW", // Placeholder
      slug: "invalid-" + Math.random(),
      price: 0,
      categoryId: "unknown",
      inStock: 0,
      status: "ERROR",
      error: errRow.error,
    });
  }

  // Bulk create items
  if (itemsToCreate.length > 0) {
    // Prisma createMany is faster
    await tx.bulk_upload_item.createMany({
      data: itemsToCreate,
    });
  }

  // Trigger product creation for valid items
  // Note: createMany doesn't return created objects with IDs easily in all DBs,
  // so if we need to link Product -> Item, we might need sequential creates or
  // a separate step.
  // The original service likely created products one by one or in batch.

  // For this migration, let's process valid items to create products
  // We need to fetch them back or just loop and create.
  // To keep it robust:

  const createdItems = await tx.bulk_upload_item.findMany({
    where: { batchId, status: "CREATED" },
  });

  for (const item of createdItems) {
    try {
      // Create Product
      const product = await tx.product.create({
        data: {
          title: item.title,
          slug: item.slug + "-" + item.id.slice(0, 4), // Ensure uniqueness
          price: item.price,
          description: item.description,
          manufacturer: item.manufacturer || "Generic",
          mainImage: item.mainImage || "placeholder.jpg",
          categoryId: item.categoryId,
          inStock: item.inStock,
          merchantId: "default-merchant", // Fallback
          bulkUploadItems: {
            connect: { id: item.id },
          },
        },
      });

      // Update item with productId
      await tx.bulk_upload_item.update({
        where: { id: item.id },
        data: { productId: product.id },
      });
    } catch (err: any) {
      console.error("Product creation failed for item:", item.id, err);
      await tx.bulk_upload_item.update({
        where: { id: item.id },
        data: { status: "ERROR", error: err.message },
      });
      successCount--;
    }
  }

  return {
    successCount,
    errorCount: errorRows.length + (validRows.length - successCount),
  };
}

export function computeBatchStatus(success: number, errors: number) {
  if (success > 0 && errors === 0) return "COMPLETED";
  if (success === 0 && errors > 0) return "FAILED";
  if (success > 0 && errors > 0) return "PARTIAL";
  return "PENDING";
}

export async function getBatchSummary(prismaClient: any, batchId: string) {
  const batch = await prismaClient.bulk_upload_batch.findUnique({
    where: { id: batchId },
  });
  return batch;
}
