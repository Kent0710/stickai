import { db } from "@/lib/schema";
import { users } from "@/lib/schema";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
        .insert(users)
        .values({
            name: username,
            password: hashedPassword,
        })
        .returning();

    return Response.json(user);
}
