"use client";

import Link from "next/link";
import Image from "next/image";
import stickailogo from "@/public/stickai-logo.webp";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

import { SidebarMenuButtonWithCaret } from "./sidebar-menu-button-with-caret";
import CreateSpace from "./create-space";
import SignOutButton from "./sign-out-button";

import { Home, Settings } from "lucide-react";
import { TbLayoutDashboard } from "react-icons/tb";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinSpace } from "@/actions/space-actions";
import { toast } from "sonner";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/* Logo */}
                    <SidebarHeader className="border-b">
                        <Link
                            href="/"
                            className="flex items-center font-semibold"
                        >
                            <Image
                                src={stickailogo}
                                alt="stickai-logo"
                                className="w-8 mr-1"
                            />
                            StickAI
                        </Link>
                    </SidebarHeader>

                    <SidebarGroupContent className="mt-3">
                        <CreateSpace />

                        {/* Menu */}
                        <SidebarMenu className="mt-3">
                            {/* Home */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/home">
                                        <Home className="mr-2 h-4 w-4" />
                                        Home
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Spaces */}
                            <SidebarMenuItem>
                                <Collapsible
                                    defaultOpen
                                    className="group/collapsible w-full"
                                >
                                    <SidebarMenuButtonWithCaret>
                                        <TbLayoutDashboard className="mr-2 h-4 w-4" />
                                        Spaces
                                    </SidebarMenuButtonWithCaret>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItemJoinSpace />
                                        </SidebarMenuSub>
                                        <SidebarMenuSub className="text-sm">
                                            <SidebarMenuSubItem>
                                                dsadas
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>

                            {/* Settings */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Sign Out */}
                            <SidebarMenuItem>
                                <SignOutButton />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export const joinSpaceFormSchema = z.object({
    spaceCode: z
        .string()
        .min(1, "Space code must be at least 1 characters")
        .max(8, "Space code must be at most 8 characters"),
});

const SidebarMenuSubItemJoinSpace = () => {
    const form = useForm<z.infer<typeof joinSpaceFormSchema>>({
        resolver: zodResolver(joinSpaceFormSchema),
        defaultValues: {
            spaceCode: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof joinSpaceFormSchema>) => {
        toast.loading("Joining space...");

        const res = await joinSpace(values);

        toast.dismiss();
        if (res.success) {
            toast.success("Successfully joined space!");
            return;
        }

        toast(res.error);
    };

    return (
        <SidebarMenuSubItem className="flex gap-2 items-center my-2">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-2 items-center"
                >
                    <FormField
                        control={form.control}
                        name="spaceCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Space code..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant={"dark"} className="text-xs h-8">
                        Join
                    </Button>
                </form>
            </Form>
        </SidebarMenuSubItem>
    );
};
