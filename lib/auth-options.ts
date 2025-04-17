import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { AuthOptions } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./schema";

import { users, accounts, sessions } from "./schema";

export const authOptions: AuthOptions = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
    }),
    providers: [
        Auth0Provider({
            clientId: "eSQ61iMnewLgGB3Z46FEXdZFHTIPkj0a",
            clientSecret:
                "O5jGfHjltSBiHYZcFVPoeqcnFA_OavHg3MsqXPQQowmo3HXcpU-1djgfgDdJqQT_",
            issuer: "https://dev-u7wvxeqm2yre7ebf.us.auth0.com",
            // authorization: {
            //     params: {
            //         prompt: "login",
            //     },
            // },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, req) {
                // You can replace this with DB lookup
                if (
                    credentials?.username === "admin" &&
                    credentials?.password === "1234"
                ) {
                    return {
                        id: "1",
                        name: "Admin",
                        email: "admin@example.com",
                    };
                }
                return null; // return null if authentication fails
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
            // allowDangerousEmailAccountLinking : true,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking : true
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
