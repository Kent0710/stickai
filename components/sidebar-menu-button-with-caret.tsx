"use client";

import { LuChevronDown } from "react-icons/lu";
import { ReactNode } from "react";
import { CollapsibleTrigger, CollapsibleTriggerProps } from "@radix-ui/react-collapsible";
import { SidebarMenuButton } from "@/components/ui/sidebar"; // adjust path to where your SidebarMenuButton lives
import { cn } from "@/lib/utils"; // utility to combine class names


interface SidebarMenuButtonWithCaretProps extends CollapsibleTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SidebarMenuButtonWithCaret = ({
  children,
  className,
  ...props
}: SidebarMenuButtonWithCaretProps) => {
  return (
    <CollapsibleTrigger asChild {...props}>
      <SidebarMenuButton
        className={cn(
          "flex items-center justify-between w-full transition",
          "group-data-[state=open]/collapsible:bg-muted",
          className
        )}
      >
        <span className="flex items-center gap-2">{children}</span>
        <LuChevronDown
          className={cn(
            "h-4 w-4 ml-2 transition-transform duration-200",
            "group-data-[state=open]/collapsible:rotate-180"
          )}
        />
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );
};
