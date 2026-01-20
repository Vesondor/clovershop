import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { AppError } from "@/lib/exceptions";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

function handleError(error: any) {
  console.error("API Error:", error);
  const message = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;
  return NextResponse.json({ error: message }, { status: statusCode });
}

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: nanoid(),
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
