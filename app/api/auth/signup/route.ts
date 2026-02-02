import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { prisma } from "@/app/server/db";
import { signupSchema } from "@/app/validation/auth";



export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input using Zod schema
        const validationResult = signupSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));

            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: errors,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validationResult.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: "User already exists",
                    message: "An account with this email already exists",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        // Handle Prisma errors
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: "Internal server error",
                    message: "An error occurred while creating your account",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: "Unknown error",
                message: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}