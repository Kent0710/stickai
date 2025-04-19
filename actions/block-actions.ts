"use server";
import { connections } from './../lib/schema';

import { db } from "@/lib/schema";
import { blocks } from "@/lib/schema"; 
import { eq } from 'drizzle-orm';
type Direction = "top" | "right" | "bottom" | "left";


interface AddBlockInput {
    spaceId: string;
    content: string;
    x: number;
    y: number;
    fromBlockId: string;
    direction: "top" | "right" | "bottom" | "left";
}

export async function addBlock({
    spaceId,
    content = "",
    x,
    y,
    fromBlockId,
    direction,
}: AddBlockInput) {
    try {
        const [newBlock] = await db
            .insert(blocks)
            .values({
                spaceId,
                content,
                x,
                y,
            })
            .returning();

        // Save connection (arrow)
        await db.insert(connections).values({
            fromBlockId,
            toBlockId: newBlock.id,
            direction,
            spaceId,
        });

        return {
            success: true,
            block: newBlock,
        };
    } catch (error) {
        console.error("Failed to add block:", error);
        return {
            success: false,
            error: "Something went wrong while adding the block.",
        };
    }
};

export async function updateBlockPositionAction({ id, x, y }: { id: string, x: number, y: number }) {
    try {
      await db.update(blocks)
        .set({ x, y })
        .where(eq(blocks.id, id));
  
      return { success: true };
    } catch (error) {
      console.error("Failed to update block position:", error);
      return { success: false, error: "Failed to update position." };
    }
  }

