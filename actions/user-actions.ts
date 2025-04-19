"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { credentialsFormSchema } from "@/app/signIn/credentials-form";
import { users } from "@/lib/schema";
import { db } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function register(values: z.infer<typeof credentialsFormSchema>) {
    try {
        const { username, password } = values;

        if (!username || !password) {
            return {
                error: "Username or password is missing. Please check your fields.",
                success: false,
            };
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.name, username),
        });

        if (existingUser) {
            return {
                error: "Username already exists. Please choose another.",
                success: false,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [user] = await db
            .insert(users)
            .values({
                name: username,
                password: hashedPassword,
            })
            
            .returning();

        if (!user) {
            return {
                error: "User not created.",
                success: false,
            };
        }

        return {
            error: "",
            success: true,
        };
    } catch (err) {
        console.error("Registration error:", err);
        return {
            error: "An unexpected error occurred during registration.",
            success: false,
        };
    }
}

export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return {
                error: "No session found.",
                success: false,
                session: session,
            };
        }

        return {
            error: "",
            success: true,
            session: session,
        };
    } catch (err) {}
}
