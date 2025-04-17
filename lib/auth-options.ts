// import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { AuthOptions } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./schema";

import { users, accounts, sessions } from "./schema";
import { eq } from "drizzle-orm";

import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
    }),
    providers: [
        // Auth0Provider({
        //     clientId: "eSQ61iMnewLgGB3Z46FEXdZFHTIPkj0a",
        //     clientSecret:
        //         "O5jGfHjltSBiHYZcFVPoeqcnFA_OavHg3MsqXPQQowmo3HXcpU-1djgfgDdJqQT_",
        //     issuer: "https://dev-u7wvxeqm2yre7ebf.us.auth0.com",
        //     // authorization: {
        //     //     params: {
        //     //         prompt: "login",
        //     //     },
        //     // },
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (
                    !credentials ||
                    !credentials.username ||
                    !credentials.password
                ) {
                    throw new Error("Missing username or password");
                }

                // 1. Check if the user exists
                const existingUser = await db.query.users.findFirst({
                    where: eq(users.name, credentials.username),
                });

                if (!existingUser) {
                    // User doesn't exist, create a new user (or handle accordingly)
                    const [newUser] = await db
                        .insert(users)
                        .values({
                            name: credentials.username,
                            password: await bcrypt.hash(
                                credentials.password,
                                10
                            ), // Hash password
                        })
                        .returning();

                    // 2. Create session and return the user
                    const sessionToken = crypto.randomUUID(); // Create a unique session token
                    const sessionExpiration = new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ); // 30 days session expiry

                    // 3. Insert session into the database
                    await db.insert(sessions).values({
                        sessionToken,
                        userId: newUser.id,
                        expires: sessionExpiration,
                    });

                    // 4. Return user info (this can include sessionToken if needed)
                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        image: newUser.image,
                        sessionToken, // Add sessionToken to response if needed
                    };
                }

                // 3. If user exists, verify the password
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    existingUser.password
                );
                if (!isPasswordValid) {
                    throw new Error("Invalid username or password");
                }

                // 4. Create a new session token for the existing user
                const sessionToken = crypto.randomUUID(); // Generate new session token
                const sessionExpiration = new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ); // 30 days session expiry

                // 5. Insert session into the database
                await db.insert(sessions).values({
                    sessionToken,
                    userId: existingUser.id,
                    expires: sessionExpiration,
                });

                // 6. Return the user info (this can include sessionToken if needed)
                return {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    image: existingUser.image,
                    sessionToken, // Add sessionToken to response if needed
                };
            },
            // async authorize(credentials, req) {
            //     if (
            //         !credentials ||
            //         !credentials.username ||
            //         !credentials.password
            //     ) {
            //         throw new Error("Missing username or password");
            //     }
            //     const existingUser = await db.query.users.findFirst({
            //         where: eq(users.name, credentials.username),
            //     });

            //     if (!existingUser) {
            //         const [newUser] = await db
            //             .insert(users)
            //             .values({})
            //             .returning();

            //         if (newUser) {
            //             return newUser;
            //         }
            //         return null;
            //     }

            //     return existingUser;
            // },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            allowDangerousEmailAccountLinking: true,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: "/signIn",
    },
    secret: process.env.AUTH0_SECRET || "",
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
};
