"use server";

import { z } from "zod";
import { spaceFormSchema } from "@/components/create-space";
import { getCurrentUser } from "./user-actions";
import { connections, db } from "@/lib/schema";
import { spaces, userSpaces } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { blocks } from "@/lib/schema";
import { joinSpaceFormSchema } from "@/components/app-sidebar";

export async function createSpace(values: z.infer<typeof spaceFormSchema>) {
    const { spaceName, spaceCode } = values;

    if (!spaceName || !spaceCode) {
        return {
            error: "Space name or code is missing. Please check your fields.",
            success: false,
        };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.session || !currentUser.success) {
        return {
            error: "Session not found from create space.",
            success: false,
        };
    }

    try {
        // Create the space
        const [space] = await db
            .insert(spaces)
            .values({
                name: spaceName,
                code: spaceCode,
            })
            .returning({ id: spaces.id });

        // Assign the user as an "owner" of the new space
        await db.insert(userSpaces).values({
            userId: currentUser.session.user.id,
            spaceId: space.id,
            role: "owner",
        });

        // Create an initial block in the center (or at default pos)
        await db.insert(blocks).values({
            spaceId: space.id,
            content: "New Block", // you can customize this
            x: 100, // default x position
            y: 100, // default y position
        });

        revalidatePath("/home");

        return {
            error: "",
            success: true,
        };
    } catch (err) {
        console.error("Space creation error: ", err);
        return {
            error: "An unexpected error occurred when creating the space. Try again.",
            success: false,
        };
    }
}

export async function getSpaces() {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.session || !currentUser.success) {
        return {
            error: "Session not found from get spaces.",
            success: false,
            spaces: [],
        };
    }

    try {
        const spacesList = await db.query.userSpaces.findMany({
            where: (userSpaces, { eq }) =>
                eq(userSpaces.userId, currentUser.session.user.id),
            with: {
                space: true,
            },
        });
        return {
            error: "",
            success: true,
            spaces: spacesList,
        };
    } catch (err) {
        console.error("Get spaces error: ", err);
        return {
            error: "An unexpected error occured when getting spaces. Try again.",
            success: false,
            spaces: [],
        };
    }
}

export async function getSpace(spaceId: string) {
    try {
        const spaceData = await db.query.spaces.findFirst({
            where: eq(spaces.id, spaceId),
        });

        if (!spaceData) {
            return { success: false, error: "Space not found." };
        }

        const [blockData, connectionData] = await Promise.all([
            db.select().from(blocks).where(eq(blocks.spaceId, spaceId)),
            db
                .select()
                .from(connections)
                .where(eq(connections.spaceId, spaceId)),
        ]);

        // Transform connections into frontend arrow format
        const arrows = connectionData.map((conn) => ({
            id: `arrow-${conn.fromBlockId}-${conn.toBlockId}`,
            from: conn.fromBlockId,
            to: conn.toBlockId,
            direction: conn.direction,
            // You can optionally recalculate fromX, fromY, toX, toY if needed
        }));

        return {
            success: true,
            space: spaceData,
            blocks: blockData,
            arrows,
        };
    } catch (error) {
        console.error("Failed to load space:", error);
        return { success: false, error: "Something went wrong loading space." };
    }
}

export async function deleteSpace(spaceId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.session || !currentUser.success) {
        return {
            error: "Session not found from delete space.",
            success: false,
        };
    }

    try {
        await db.delete(userSpaces).where(eq(userSpaces.spaceId, spaceId));
        await db.delete(spaces).where(eq(spaces.id, spaceId));
        revalidatePath("/home");
        return {
            error: "",
            success: true,
        };
    } catch (err) {
        console.error("Delete space error: ", err);
        return {
            error: "An unexpected error occurred when deleting space. Try again.",
            success: false,
        };
    }
}

export async function joinSpace(values: z.infer<typeof joinSpaceFormSchema>) {
    const { spaceCode } = values;

    if (!spaceCode) {
        return {
            error: "Space code is missing. Please check your fields.",
            success: false,
        };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.session || !currentUser.success) {
        return {
            error: "Session not found from join space.",
            success: false,
        };
    }

    try {
        // Check if the space exists
        const space = await db.query.spaces.findFirst({
            where: eq(spaces.code, spaceCode),
        });

        if (!space) {
            return {
                error: "Space not found. Please check the code.",
                success: false,
            };
        }

        // Check if the user is already a member of the space
        const existingMembership = await db.query.userSpaces.findFirst({
            where: (userSpaces, { eq }) =>
                eq(userSpaces.userId, currentUser.session.user.id) &&
                eq(userSpaces.spaceId, space.id),
        });

        if (existingMembership) {
            return {
                error: "You are already a member of this space.",
                success: false,
            };
        }

        // Add the user to the space with a default role (e.g., "member")
        await db.insert(userSpaces).values({
            userId: currentUser.session.user.id,
            spaceId: space.id,
            role: "member",
        });

        revalidatePath("/home");

        return {
            error: "",
            success: true,
        };
    } catch (err) {
        console.error("Join space error: ", err);
        return {
            error: "An unexpected error occurred when joining the space. Try again.",
            success: false,
        };
    }
}
