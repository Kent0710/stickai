"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { register } from "@/actions/user-actions";
import { redirect } from "next/navigation";
import LoadingButton from "@/components/loading-button";

export const credentialsFormSchema = z.object({
    username: z.string().min(1).max(40),
    password: z.string().min(1).max(40),
});

export default function RegisterForm() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof credentialsFormSchema>>({
        resolver: zodResolver(credentialsFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleFormOnSubmit = async (
        values: z.infer<typeof credentialsFormSchema>
    ) => {
        setIsLoading(true);
        await register(values).then(async (res) => {
            if (res.success) {
                const { username, password } = values;

                const login = await signIn("credentials", {
                    redirect: false,
                    username,
                    password,
                });

                if (login && login.ok) {
                    redirect("/");
                } else {
                    setError("Login failed after signup");
                }
            } else {
                setError(res.error);
            }
            setIsLoading(false);
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormOnSubmit)}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} type="text" required />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" required />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <p> {error} </p>
                <LoadingButton isLoading={isLoading} type="submit">
                    Create account
                </LoadingButton>
            </form>
        </Form>
    );
}
