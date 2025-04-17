// app/signin/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import SignInClient from "./sign-in-client";

export default async function SignInPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    const providers = await getProviders();

    return <SignInClient providers={providers} />;
}
