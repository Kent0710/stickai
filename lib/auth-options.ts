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

           
                const existingUser = await db.query.users.findFirst({
                    where: eq(users.name, credentials.username),
                });

                if (!existingUser) {

                    const [newUser] = await db
                        .insert(users)
                        .values({
                            name: credentials.username,
                            password: await bcrypt.hash(
                                credentials.password,
                                10
                            ), 
                        })
                        .returning();

            
                    const sessionToken = crypto.randomUUID(); 
                    const sessionExpiration = new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    );

                
                    await db.insert(sessions).values({
                        sessionToken,
                        userId: newUser.id,
                        expires: sessionExpiration,
                    });

              
                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        image: newUser.image,
                        sessionToken, 
                    };
                }

             
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    existingUser.password
                );
                if (!isPasswordValid) {
                    throw new Error("Invalid username or password");
                }

       
                const sessionToken = crypto.randomUUID();
                const sessionExpiration = new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ); 

            
                await db.insert(sessions).values({
                    sessionToken,
                    userId: existingUser.id,
                    expires: sessionExpiration,
                });

               
                return {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    image: existingUser.image,
                    sessionToken, 
                };
            },
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
    callbacks: {
        async session({ session }) {
            if (session && session.user) {
                const user = await db.query.users.findFirst({
                    where: eq(users.name, session.user.name as string),
                });
                session.user.id = user?.id
            }

            return session;
        },
    },
};
