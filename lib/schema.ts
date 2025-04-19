// db.ts (or any file name you use)

import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-http";
import { pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { serial } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);

// 1. Define schema
export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").unique(),
    password: text("password").unique(),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const spaces = pgTable("space", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const userSpaces = pgTable(
    "user_space",
    {
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        spaceId: text("space_id")
            .notNull()
            .references(() => spaces.id, { onDelete: "cascade" }),
        role: text("role").notNull(), // e.g., 'admin', 'member'
        joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow(),
    },
    (table) => [primaryKey(table.userId, table.spaceId)]
);

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<string>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [primaryKey(account.provider, account.providerAccountId)]
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => [primaryKey(vt.identifier, vt.token)]
);

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (a) => [primaryKey(a.userId, a.credentialID)]
);

export const userSpacesRelations = relations(userSpaces, ({ one }) => ({
    space: one(spaces, {
        fields: [userSpaces.spaceId],
        references: [spaces.id],
    }),
}));


export const blocks = pgTable("block", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    spaceId: text("space_id")
        .notNull()
        .references(() => spaces.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const connections = pgTable("connections", {
    id: serial("id").primaryKey(),
    fromBlockId: text("from_block_id").notNull(),
    toBlockId: text("to_block_id").notNull(),
    direction: text("direction"), // optional: top, right, etc.
    spaceId: text("space_id").notNull(),
});
// 2. Pass the schema to drizzle
export const db = drizzle(process.env.DATABASE_URL!, {
    schema: {
        users,
        accounts,
        sessions,
        verificationTokens,
        authenticators,
        spaces,
        userSpaces,
        userSpacesRelations,
        blocks,
        connections,
    },
});
