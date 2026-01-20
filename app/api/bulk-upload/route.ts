import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";
import {
  parseCsvBufferToRows,
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
} from "@/lib/bulkUploadService";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new AppError("CSV file is required (field name: 'file')", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rows = await parseCsvBufferToRows(buffer);

    if (!rows || rows.length === 0) {
      throw new AppError("CSV has no rows", 400);
    }

    const valid: any[] = [];
    const errors: any[] = [];
    for (let i = 0; i < rows.length; i++) {
      const { ok, data, error } = validateRow(rows[i]);
      if (ok) valid.push(data);
      else errors.push({ index: i + 1, error });
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdBatch = await tx.bulk_upload_batch.create({
        data: {
          fileName: file.name,
          status: "PENDING",
          itemCount: rows.length,
          errorCount: errors.length,
        },
      });

      const { successCount, errorCount } = await createBatchWithItems(
        tx,
        createdBatch.id,
        valid,
        errors,
      );

      const finalStatus = computeBatchStatus(successCount, errorCount);
      const batch = await tx.bulk_upload_batch.update({
        where: { id: createdBatch.id },
        data: {
          status: finalStatus,
          itemCount: successCount + errorCount,
          errorCount,
        },
      });

      return batch;
    });

    const summary = await getBatchSummary(prisma, result.id);

    return NextResponse.json(
      {
        batchId: result.id,
        status: result.status,
        ...summary,
        validationErrors: errors,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const batches = await prisma.bulk_upload_batch.findMany({
      orderBy: { createdAt: "desc" },
    });

    const batchesWithDetails = await Promise.all(
      batches.map(async (batch) => {
        const items = await prisma.bulk_upload_item.findMany({
          where: { batchId: batch.id },
        });

        const successfulRecords = items.filter(
          (item) => item.status === "CREATED" && item.productId !== null,
        ).length;
        const failedRecords = items.filter(
          (item) => item.status === "ERROR" || item.error !== null,
        ).length;

        const errors = items
          .filter((item) => item.error)
          .map((item) => item.error);

        return {
          id: batch.id,
          fileName: batch.fileName || `batch-${batch.id.substring(0, 8)}.csv`,
          totalRecords: items.length,
          successfulRecords,
          failedRecords,
          status: batch.status,
          uploadedBy: "Admin",
          uploadedAt: batch.createdAt,
          errors: errors.slice(0, 50), // Limit for safety
        };
      }),
    );

    return NextResponse.json({ batches: batchesWithDetails });
  } catch (error) {
    return handleError(error);
  }
}
