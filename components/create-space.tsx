"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { createSpace } from "@/actions/space-actions";
import { useState } from "react";
import { toast } from "sonner";
import { createSpace } from "@/actions/space-actions";

export const spaceFormSchema = z.object({
    spaceName: z
        .string()
        .min(1, "Space name must be at least 1 characters")
        .max(30, "Space name must be at most 30 characters"),
    spaceCode: z
        .string()
        .min(1, "Space code must be at least 3 characters")
        .max(8, "Space code must be at most 8 characters"),
});

const generateSpaceCode = (length: number = 8): string => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
};

const CreateSpace = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof spaceFormSchema>>({
        resolver: zodResolver(spaceFormSchema),
        defaultValues: {
            spaceName: "",
            spaceCode: "",
        },
    });

    const handleGenerateCode = () => {
        const newCode = generateSpaceCode();
        form.setValue("spaceCode", newCode);
    };

    async function onSubmit(values: z.infer<typeof spaceFormSchema>) {
        const toastId = toast.loading("Creating space...");

        const res = await createSpace(values);

        if (!res.success) {
            setErrorMessage(res.error);
            toast.error("Failed to create space.", { id: toastId });
            return;
        }

        toast.success(`${values.spaceName} created.`, { id: toastId });
        form.reset();
    }

    return (
        <Dialog>
            <DialogTrigger className="flex items-center  gap-2  bg-blue-600 py-2  w-full justify-center  rounded-md hover:bg-blue-600/70 font-semibold text-white">
                <SquarePen size={17} />
                Create space
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start with something new</DialogTitle>
                    <DialogDescription>
                        Provide a name for your new space. You can change this
                        later.
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 mt-3"
                        >
                            <FormField
                                control={form.control}
                                name="spaceName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Space Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Space name..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your new space name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="spaceCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <div>
                                            <FormLabel>Space Code</FormLabel>
                                            <p>{errorMessage}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="Unique space code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                variant="special"
                                                type="button"
                                                onClick={handleGenerateCode}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                        <FormDescription>
                                            This is your new space unique code.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-x-3">
                                <DialogClose asChild>
                                    <Button type="submit">Create space</Button>
                                </DialogClose>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CreateSpace;
