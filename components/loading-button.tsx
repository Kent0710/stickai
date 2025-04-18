"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import React from "react";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
    isLoading: boolean;
    loadingText?: string;
    children: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    loadingText = "Loading...",
    children,
}) => {
    return (
        <Button
            className={cn("w-full text-center")}
            disabled={isLoading}
        >
            {isLoading && <Loader2 className=" h-4 w-4 animate-spin" />}
            {isLoading ? loadingText : children}
        </Button>
    );
};

export default LoadingButton;
