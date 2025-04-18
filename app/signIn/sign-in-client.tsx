"use client";

import { signIn } from "next-auth/react";
import SignInForm from "./credentials-form";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

import stickailogo from "@/public/stickai-logo.webp";
import Image from "next/image";

import Link from "next/link";

type Provider = {
    id: string;
    name: string;
};

type Props = {
    providers: Record<string, Provider> | null;
};

const providerIcons: Record<string, JSX.Element> = {
    google: <FcGoogle className="mr-2" />,
    discord: <FaDiscord className="mr-2" />,
};

export default function SignInClient({ providers }: Props) {
    if (!providers) return <p>No providers found</p>;

    return (
        <div className=" flex items-center justify-center px-4 py-8 min-h-[100dvh]  ">
            {/* Form wrapper with size */}
            <div className="w-full max-w-sm  rounded-lg shadow-md border bg-white  p-6 flex flex-col justify-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src={stickailogo}
                        alt="stickai-logo"
                        className="w-12 mb-3  rounded-lg  shadow-sm border "
                    />
                    <h1> Sign Up </h1>
                    <p> Get started with StickAI. </p>
                </div>

                <SignInForm />

                {/* Third-party providers */}
                <div className="flex flex-col items-center gap-3">
                    <small> Or sign up with </small>
                    {Object.values(providers)
                        .filter((provider) => provider.id !== "credentials")
                        .map((provider) => (
                            <Button
                                key={provider.name}
                                onClick={() =>
                                    signIn(provider.id, { callbackUrl: "/" })
                                }
                                variant={"secondary"}
                                className="w-full flex items-center justify-center"
                            >
                                {providerIcons[provider.id] ?? null}
                                Sign in with {provider.name}
                            </Button>
                        ))}
                </div>

                <div className="flex gap-2 items-center place-self-center border-t pt-2">
                    <Link
                        href={"/privacy"}
                        className="flex items-center gap-2 underline"
                    >
                        <small>How we store your data?</small>
                    </Link>
                </div>
            </div>
        </div>
    );
}
