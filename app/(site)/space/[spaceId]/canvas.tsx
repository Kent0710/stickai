"use client";

import { Move, ZoomIn, ZoomOut } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface CanvasControlsProps {
    setBlocks: Dispatch<
        SetStateAction<
            {
                id: string;
                content: string;
                x: number;
                y: number;
            }[]
        >
    >;
    setArrows: Dispatch<SetStateAction<never[]>>;
    setPanOffset: Dispatch<
        SetStateAction<{
            x: number;
            y: number;
        }>
    >;
    zoom: number;
    setZoom: Dispatch<SetStateAction<number>>;
}
export const CanvasControls: React.FC<CanvasControlsProps> = ({
    setBlocks,
    setArrows,
    setPanOffset,
    zoom,
    setZoom,
}) => {
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    return (
        <div className="absolute top-4 right-4 z-50 flex gap-2 bg-white p-2 rounded-md shadow-md">
            <Button onClick={handleZoomIn} variant={"dark"}>
                <ZoomIn size={20} />
            </Button>
            <div className="flex items-center px-2">
                {Math.round(zoom * 100)}%
            </div>
            <Button onClick={handleZoomOut} variant={"dark"}>
                <ZoomOut size={20} />
            </Button>
            <Button
                onClick={() => {
                    setZoom(1);
                    setPanOffset({ x: 0, y: 0 });
                }}
                variant={"dark"}
            >
                <Move size={20} />
                <span className="ml-1">Reset</span>
            </Button>
            <Button
                variant={"dark"}
                onClick={() => {
                    setBlocks([
                        {
                            id: "1",
                            content: "Drag me and edit my content",
                            x: 100,
                            y: 100,
                        },
                    ]);
                    setArrows([]);
                }}
            >
                <Move size={20} />
                <span className="ml-1">Clear</span>
            </Button>
        </div>
    );
};
