"use client";

import { useState, useRef, useEffect } from "react";
import {
    Plus,
    ArrowUp,
    ArrowRight,
    ArrowDown,
    ArrowLeft,
    ZoomIn,
    ZoomOut,
    Move,
} from "lucide-react";
import Block from "./block";
import { CanvasControls } from "./canvas";
import { v4 as uuidv4 } from "uuid"; // Install uuid if needed
import { addBlock as addBlockAction } from "@/actions/block-actions";
import { updateBlockPositionAction } from "@/actions/block-actions";

import { BlockContainer } from "./block";
import { toast } from "sonner";

export default function Board({
    spaceId,
    initialBlocks = [],
    initialArrows = [],
}) {
    const [blocks, setBlocks] = useState(initialBlocks || []);
    const [arrows, setArrows] = useState(initialArrows || []);
    const [activeBlock, setActiveBlock] = useState(null);
    const [editingBlock, setEditingBlock] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [canvasDimensions, setCanvasDimensions] = useState({
        width: 3000,
        height: 3000,
    });
    const boardRef = useRef(null);

    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        // Trigger once blocks are in DOM
        if (blocks.length > 0) {
            // Slight delay to ensure layout is fully flushed
            const timeout = setTimeout(() => {
                setIsLayoutReady(true);
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [blocks]);

    const blockWidth = 160; // w-40 (Tailwind: 40 * 4px = 160px)
    const blockHeight = 96; // Approximate height based on h-20 (80px) + padding

    const handleBlockMouseDown = (e, block) => {
        if (editingBlock === block.id) return;

        const board = boardRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - (block.x * zoom + panOffset.x + board.left),
            y: e.clientY - (block.y * zoom + panOffset.y + board.top),
        });
        setActiveBlock(block.id);
        e.stopPropagation();
    };

    const handleBlockMouseMove = (e) => {
        if (!activeBlock) return;

        const board = boardRef.current.getBoundingClientRect();
        const newX =
            (e.clientX - board.left - panOffset.x - dragOffset.x) / zoom;
        const newY =
            (e.clientY - board.top - panOffset.y - dragOffset.y) / zoom;

        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === activeBlock
                    ? { ...block, x: newX, y: newY }
                    : block
            )
        );

        updateCanvasDimensions(newX, newY);
    };

    const updateCanvasDimensions = (x, y) => {
        const padding = 500;
        let newWidth = canvasDimensions.width;
        let newHeight = canvasDimensions.height;

        if (x + blockWidth + padding > newWidth) {
            newWidth = x + blockWidth + padding;
        }
        if (y + blockHeight + padding > newHeight) {
            newHeight = y + blockHeight + padding;
        }
        if (x - padding < 0) {
            newWidth = Math.max(
                newWidth,
                canvasDimensions.width - (x - padding)
            );
        }
        if (y - padding < 0) {
            newHeight = Math.max(
                newHeight,
                canvasDimensions.height - (y - padding)
            );
        }

        if (
            newWidth !== canvasDimensions.width ||
            newHeight !== canvasDimensions.height
        ) {
            setCanvasDimensions({ width: newWidth, height: newHeight });
        }
    };

    const handleCanvasMouseDown = (e) => {
        if (
            e.target.closest(".block-container") ||
            e.target.closest(".block-button")
        ) {
            return;
        }

        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleCanvasMouseMove = (e) => {
        if (!isPanning) return;

        const newPanOffset = {
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y,
        };

        setPanOffset(newPanOffset);
    };

    const handleMouseUp = async () => {
        if (activeBlock) {
        setActiveBlock(null);

            const block = blocks.find((b) => b.id === activeBlock);
            if (block && !block.id.startsWith("temp-")) {
                try {
                    const res = await updateBlockPositionAction({
                        id: block.id,
                        x: block.x,
                        y: block.y,
                    })
                    if (res) toast('position has been updated.')
                } catch (err) {
                    console.error("Failed to persist block position:", err);
                }
            }
        }

        setIsPanning(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoom((prev) => Math.min(prev + 0.05, 2));
        } else {
            setZoom((prev) => Math.max(prev - 0.05, 0.5));
        }
    };

    const startEditing = (id) => {
        setEditingBlock(id);
    };

    const handleContentChange = (e, id) => {
        setBlocks(
            blocks.map((block) =>
                block.id === id ? { ...block, content: e.target.value } : block
            )
        );
    };

    const addBlock = async (sourceId, direction) => {
        const sourceBlock = blocks.find((block) => block.id === sourceId);
        if (!sourceBlock) return;

        const spacing = 200;
        const tempId = `temp-${uuidv4()}`;

        let newX = sourceBlock.x;
        let newY = sourceBlock.y;

        switch (direction) {
            case "top":
                newY -= spacing;
                break;
            case "right":
                newX += spacing;
                break;
            case "bottom":
                newY += spacing;
                break;
            case "left":
                newX -= spacing;
                break;
        }

        const optimisticBlock = {
            id: tempId,
            content: "New Block",
            x: newX,
            y: newY,
        };

        const fromX = sourceBlock.x + blockWidth / 2;
        const fromY = sourceBlock.y + blockHeight / 2;

        let toX = newX + blockWidth / 2;
        let toY = newY + blockHeight / 2;

        switch (direction) {
            case "top":
                toY = newY + blockHeight;
                break;
            case "right":
                toX = newX;
                break;
            case "bottom":
                toY = newY;
                break;
            case "left":
                toX = newX + blockWidth;
                break;
        }

        const optimisticArrow = {
            id: `arrow-${sourceId}-${tempId}`,
            from: sourceId,
            to: tempId,
            fromX,
            fromY,
            toX,
            toY,
            direction,
        };

        // 🧠 Optimistically update state
        setBlocks((prev) => [...prev, optimisticBlock]);
        setArrows((prev) => [...prev, optimisticArrow]);
        updateCanvasDimensions(newX, newY);

        try {
            const response = await addBlockAction({
                spaceId,
                content: "New Block",
                x: newX,
                y: newY,
                fromBlockId: sourceId,
                direction,
            });

            if (!response.success) throw new Error(response.error);

            const newBlock = response.block;

            // 🛠 Replace temp block with real one
            setBlocks((prev) =>
                prev.map((block) => (block.id === tempId ? newBlock : block))
            );

            setArrows((prev) =>
                prev.map((arrow) =>
                    arrow.to === tempId
                        ? {
                              ...arrow,
                              id: `arrow-${sourceId}-${newBlock.id}`,
                              to: newBlock.id,
                          }
                        : arrow
                )
            );
        } catch (err) {
            console.error("Server failed:", err);

            // ❌ Rollback optimistic updates
            setBlocks((prev) => prev.filter((block) => block.id !== tempId));
            setArrows((prev) => prev.filter((arrow) => arrow.to !== tempId));
        }
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (activeBlock) handleBlockMouseMove(e);
            if (isPanning) handleCanvasMouseMove(e);
        };

        const handleGlobalMouseUp = () => handleMouseUp();

        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);

        const wheelHandler = (e) => {
            const boardRect = boardRef.current.getBoundingClientRect();
            if (
                e.clientX >= boardRect.left &&
                e.clientX <= boardRect.right &&
                e.clientY >= boardRect.top &&
                e.clientY <= boardRect.bottom
            ) {
                e.preventDefault();
            }
        };

        window.addEventListener("wheel", wheelHandler, { passive: false });

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            window.removeEventListener("wheel", wheelHandler);
        };
    }, [
        activeBlock,
        isPanning,
        dragOffset,
        panStart,
        panOffset,
        zoom,
        blocks,
        arrows,
    ]);

    const minX = Math.min(
        ...blocks.map((b) => b.x),
        ...arrows.map((a) => Math.min(a.fromX, a.toX)),
        0
    );
    const minY = Math.min(
        ...blocks.map((b) => b.y),
        ...arrows.map((a) => Math.min(a.fromY, a.toY)),
        0
    );
    const maxX = Math.max(
        ...blocks.map((b) => b.x + blockWidth),
        ...arrows.map((a) => Math.max(a.fromX, a.toX)),
        canvasDimensions.width
    );
    const maxY = Math.max(
        ...blocks.map((b) => b.y + blockHeight),
        ...arrows.map((a) => Math.max(a.fromY, a.toY)),
        canvasDimensions.height
    );

    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    useEffect(() => {
        let animationFrame;

        const updateArrowPositions = () => {
            setArrows((prevArrows) =>
                prevArrows.map((arrow) => {
                    const fromBlock = blocks.find((b) => b.id === arrow.from);
                    const toBlock = blocks.find((b) => b.id === arrow.to);
                    if (!fromBlock || !toBlock) return arrow;

                    return {
                        ...arrow,
                        fromX: fromBlock.x + blockWidth / 2,
                        fromY: fromBlock.y + blockHeight / 2,
                        toX: toBlock.x + blockWidth / 2,
                        toY: toBlock.y + blockHeight / 2,
                    };
                })
            );
        };

        animationFrame = requestAnimationFrame(updateArrowPositions);

        return () => cancelAnimationFrame(animationFrame);
    }, [blocks]); // just blocks is enough

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-50">
            <CanvasControls
                setBlocks={setBlocks}
                setArrows={setArrows}
                setPanOffset={setPanOffset}
                zoom={zoom}
                setZoom={setZoom}
            />

            <div
                ref={boardRef}
                className={`relative w-full h-screen overflow-hidden bg-gray-100 cursor-grab ${
                    isPanning ? "select-none" : ""
                }`}
                style={{
                    background:
                        "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')",
                }}
                onMouseDown={handleCanvasMouseDown}
                onClick={() => setEditingBlock(null)}
                onWheel={handleWheel}
                onDragStart={(e) => e.preventDefault()}
            >
                {/* <div
                    className="absolute top-0 left-0 w-full h-full z-0"
                    onMouseDown={handleCanvasMouseDown}
                    onDragStart={(e) => e.preventDefault()}
                /> */}

                <div
                    className="absolute origin-top-left z-10"
                    style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                        width: `${canvasDimensions.width}px`,
                        height: `${canvasDimensions.height}px`,
                    }}
                >
                    <svg
                        className="absolute pointer-events-none"
                        style={{
                            left: `${minX}px`,
                            top: `${minY}px`,
                            width: `${svgWidth}px`,
                            height: `${svgHeight}px`,
                        }}
                    >
                        {isLayoutReady &&
                            arrows.map((arrow) => (
                                <g
                                    transform={`translate(${-minX}, ${-minY})`}
                                    key={arrow.id}
                                >
                                    {arrows.map((arrow) => {
                                        const isCurved = true;
                                        let path;

                                        if (isCurved) {
                                            let controlPoint1X,
                                                controlPoint1Y,
                                                controlPoint2X,
                                                controlPoint2Y;
                                            const offset = 80;

                                            switch (arrow.direction) {
                                                case "top":
                                                    controlPoint1X =
                                                        arrow.fromX;
                                                    controlPoint1Y =
                                                        arrow.fromY - offset;
                                                    controlPoint2X = arrow.toX;
                                                    controlPoint2Y =
                                                        arrow.toY + offset;
                                                    break;
                                                case "right":
                                                    controlPoint1X =
                                                        arrow.fromX + offset;
                                                    controlPoint1Y =
                                                        arrow.fromY;
                                                    controlPoint2X =
                                                        arrow.toX - offset;
                                                    controlPoint2Y = arrow.toY;
                                                    break;
                                                case "bottom":
                                                    controlPoint1X =
                                                        arrow.fromX;
                                                    controlPoint1Y =
                                                        arrow.fromY + offset;
                                                    controlPoint2X = arrow.toX;
                                                    controlPoint2Y =
                                                        arrow.toY - offset;
                                                    break;
                                                case "left":
                                                    controlPoint1X =
                                                        arrow.fromX - offset;
                                                    controlPoint1Y =
                                                        arrow.fromY;
                                                    controlPoint2X =
                                                        arrow.toX + offset;
                                                    controlPoint2Y = arrow.toY;
                                                    break;
                                                default:
                                                    break;
                                            }

                                            path = `M ${arrow.fromX} ${arrow.fromY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${arrow.toX} ${arrow.toY}`;
                                        } else {
                                            path = `M ${arrow.fromX} ${arrow.fromY} L ${arrow.toX} ${arrow.toY}`;
                                        }

                                        const dx = arrow.toX - arrow.fromX;
                                        const dy = arrow.toY - arrow.fromY;
                                        const angle = Math.atan2(dy, dx);
                                        const length = 10;

                                        const arrowHead1X =
                                            arrow.toX -
                                            length *
                                                Math.cos(angle - Math.PI / 6);
                                        const arrowHead1Y =
                                            arrow.toY -
                                            length *
                                                Math.sin(angle - Math.PI / 6);
                                        const arrowHead2X =
                                            arrow.toX -
                                            length *
                                                Math.cos(angle + Math.PI / 6);
                                        const arrowHead2Y =
                                            arrow.toY -
                                            length *
                                                Math.sin(angle + Math.PI / 6);

                                        return (
                                            <g key={arrow.id}>
                                                <path
                                                    d={path}
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="2"
                                                />
                                                <polygon
                                                    points={`${arrow.toX},${arrow.toY} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
                                                    fill="black"
                                                />
                                            </g>
                                        );
                                    })}
                                </g>
                            ))}
                    </svg>
                    <BlockContainer setSelectedBlock={setSelectedBlock}>
                        {blocks.map((block) => (
                            <Block
                                key={block.id}
                                handleBlockMouseDown={handleBlockMouseDown}
                                activeBlock={activeBlock}
                                block={block}
                                setSelectedBlock={setSelectedBlock}
                                handleContentChange={handleContentChange}
                                startEditing={startEditing}
                                addBlock={addBlock}
                                selectedBlock={selectedBlock}
                                editingBlock={editingBlock}
                            />
                        ))}
                    </BlockContainer>
                </div>
            </div>
        </div>
    );
}
