import Auth0Provider from "next-auth/providers/auth0";
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
