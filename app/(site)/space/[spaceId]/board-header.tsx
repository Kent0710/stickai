import { ChevronLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import { TbBaselineDensityMedium } from "react-icons/tb";

interface BoardHeaderProps {
    spaceId?: string;
    className?: string;
}
const BoardHeader: React.FC<BoardHeaderProps> = ({ spaceId, className }) => {
    return (
        <header className={`${className}`}>
            <section className="flex items-center space-x-3 flex-wrap">
                <div className="flex items-center">
                    <Link href={"/home"}>
                        <ChevronLeft
                            size={33}
                            className="p-2 rounded-lg hover:bg-neutral-200"
                        />
                    </Link>
                    <h1 className="font-bold text-2xl ml-1"> Space Name </h1>
                </div>
                <Badge> Basic </Badge>
            </section>

            <ul className="flex items-center gap-3">
                <small> 3 people are here </small>
                <TbBaselineDensityMedium />{" "}
            </ul>
        </header>
    );
};

export default BoardHeader;
