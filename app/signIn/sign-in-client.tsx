'use client';

import { signIn } from "next-auth/react";

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
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    );
}
