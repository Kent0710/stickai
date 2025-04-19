"use client";

import {Button} from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    BrainCircuit,
    SquareChevronLeft,
    SquareArrowUpRight,
} from "lucide-react";
import React, { useState } from "react";
// import InviteUsers from "./invite-users";

interface AISidebarProps {
    className? : string;
}
const AISidebar : React.FC<AISidebarProps> = ({
    className,
}) => {
    const [selectedConversation, setSelectedConversation] = useState(-1);

    return (
        <div className={`${className}`}>
            <div className="space-x-2 flex items-center justify-end">
                <Button>
                    {" "}
                    <BrainCircuit size={27} /> AI Generate{" "}
                </Button>
                {/* <InviteUsers buttonVariant={'secondary'} /> */}
            </div>
            <ScrollArea className="lg:h-full h-[50vh]  w-full  p-4" >
                <ul className="space-y-3 ">
                    {selectedConversation === -1 ? (
                        <>
                            {Array.from({ length: 10 }, (_, i) => (
                                <li
                                    key={i}
                                    className="w-full h-[5rem] bg-orange-300 rounded-lg hover:cursor-pointer"
                                    onClick={() => setSelectedConversation(i)}
                                >
                                    {" "}
                                    {i}{" "}
                                </li>
                            ))}
                        </>
                    ) : (
                        <div>
                            <div className="flex">
                                <button
                                    className="flex items-center gap-1 p-2 hover:cursor-pointer text-xs rounded-lg hover:bg-neutral-200  text-neutral-800 font-semibold w-fit"
                                    onClick={() => setSelectedConversation(-1)}
                                >
                                    <SquareChevronLeft size={17} />
                                </button>
                                <button
                                    className="flex items-center gap-1 p-2 hover:cursor-pointer text-xs rounded-lg hover:bg-neutral-200  text-neutral-800 font-semibold w-fit"
                                    onClick={() => {
                                        window.open('/conversation/1', '_blank')!.focus()
                                    }}
                                >
                                    <SquareArrowUpRight size={17} />
                                </button>
                            </div>
                            {selectedConversation}
                        </div>
                    )}
                </ul>
            </ScrollArea>
        </div>
    );
};

export default AISidebar;
