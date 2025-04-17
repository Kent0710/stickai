"use client";

import { signIn } from "next-auth/react";
import SignInForm from "./credentials-form";

type Provider = {
    id: string;
    name: string;
};

type Props = {
    providers: Record<string, Provider> | null;
};

export default function SignInClient({ providers }: Props) {
    if (!providers) return <p>No providers found</p>;

    return (
        <div>
            <SignInForm />

            {Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider) => (
                    <div key={provider.name}>
                        <button
                            onClick={() =>
                                signIn(provider.id, { callbackUrl: "/" })
                            }
                        >
                            Sign in with {provider.name}
                        </button>
                    </div>
                ))}
        </div>
    );
}
