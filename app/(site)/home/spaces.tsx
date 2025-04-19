import { getSpaces } from "@/actions/space-actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

import DeleteSpace from "@/components/delete-space";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { IoCopyOutline } from "react-icons/io5";
import { TbBaselineDensityMedium } from "react-icons/tb";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Spaces = async () => {
    const { spaces } = await getSpaces();

    return (
        <div className="flex gap-3 flex-wrap">
            {spaces.map((space) => (
                <SpaceCard
                    key={space.space.code}
                    spaceName={space.space.name}
                    spaceCode={space.space.code}
                    id={space.space.id}
                    createdAt={space.space.createdAt?.toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }
                    )}
                />
            ))}
        </div>
    );
};

export default Spaces;

interface SpaceCardProps {
    spaceName: string;
    createdAt: string | undefined;
    id: string;
    spaceCode: string;
}
const SpaceCard: React.FC<SpaceCardProps> = ({
    spaceName,
    createdAt,
    id,
    spaceCode,
}) => {
    return (
        <Card>
            <CardContent className="text-sm w-[17rem] space-y-3">
                <header className="w-full justify-between flex items-center gap-3">
                    <div className="space-x-2">
                        <Badge variant="default"> Owned </Badge>
                        <Badge variant="outline"> Shared </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {" "}
                            <TbBaselineDensityMedium />{" "}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <div className="flex items-center gap-2 mr-4">
                                        <FiUserPlus />
                                        Invite users
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuLabel>
                                            Invite users via code or link
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem className="space-y-2 flex flex-col items-start">
                                            <p> 1. Use space code </p>
                                            <div className="flex items-center gap-2 -mt-2">
                                                <Input
                                                    placeholder={spaceCode}
                                                    disabled={true}
                                                />
                                                <IoCopyOutline />
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="space-y-2 flex flex-col items-start">
                                            <p> 2. Use invitation link </p>
                                            <div className="flex items-center gap-2 -mt-2">
                                                <Input
                                                    placeholder={`http://localhost:3000/spaces/invite/${spaceCode}`}
                                                    disabled={true}
                                                />
                                                <IoCopyOutline />
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                <DeleteSpace spaceId={id} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <Link href={`/space/${id}`} className="w-full hover:underline">
                    <CardTitle className="">{spaceName}</CardTitle>
                    <CardDescription>
                        <small>{createdAt}</small>
                    </CardDescription>
                </Link>
            </CardContent>
        </Card>
    );
};
