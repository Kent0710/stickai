import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import React, { SetStateAction } from "react";

interface BlockContainerProps {
    setSelectedBlock: (value: SetStateAction<null>) => void;
    children: React.ReactNode;
}
export const BlockContainer: React.FC<BlockContainerProps> = ({
    setSelectedBlock,
    children,
}) => {
    return (
        <div
            className="relative w-full h-full"
            onClick={() => setSelectedBlock(null)}
        >
            {children}
        </div>
    );
};

interface BlockProps {
    handleBlockMouseDown: (e: any, block: any) => void;
    activeBlock: null;
    block: {
        id: string;
        content: string;
        x: number;
        y: number;
    };
    setSelectedBlock: (value: SetStateAction<null>) => void;
    handleContentChange: (e: any, id: any) => void;
    startEditing: (id: any) => void;
    addBlock: (sourceId: any, direction: any) => void;
    selectedBlock: null;
    editingBlock: null;
}

const Block: React.FC<BlockProps> = ({
    handleBlockMouseDown,
    activeBlock,
    block,
    setSelectedBlock,
    handleContentChange,
    startEditing,
    addBlock,
    selectedBlock,
    editingBlock,
}) => {
    return (
        <div
            key={block.id}
            className={`absolute bg-white rounded-2xl shadow-sm w-40 p-3 border transition-all ${
                activeBlock === block.id
                    ? "z-20 ring-2 ring-ring shadow-md cursor-grabbing select-none"
                    : selectedBlock === block.id
                    ? "border-primary z-10 cursor-pointer"
                    : "border-muted z-10 cursor-pointer hover:shadow-md"
            }`}
            style={{
                transform: `translate(${block.x}px, ${block.y}px)`,
                transition:
                    activeBlock === block.id ? "none" : "transform 0.1s ease",
            }}
            onMouseDown={(e) => handleBlockMouseDown(e, block)}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedBlock(block.id);
            }}
            onDragStart={(e) => e.preventDefault()}
        >
            {editingBlock === block.id ? (
                <textarea
                    className="w-full h-20 p-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    value={block.content}
                    onChange={(e) => handleContentChange(e, block.id)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                />
            ) : (
                <div
                    className="min-h-16 text-sm text-foreground whitespace-pre-wrap p-1"
                    onDoubleClick={() => startEditing(block.id)}
                >
                    {block.content}
                </div>
            )}

            {selectedBlock === block.id && (
                <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-6 z-30">
                        <button
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                addBlock(block.id, "top");
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-center gap-0.5">
                                <ArrowUp size={17} />
                            </div>
                        </button>
                    </div>

                    <div className="absolute -right-3 top-1/2 translate-x-6 -translate-y-1/2 z-30">
                        <button
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                addBlock(block.id, "right");
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-center gap-0.5">
                                <ArrowRight size={17} />
                            </div>
                        </button>
                    </div>

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-6 z-30">
                        <button
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                addBlock(block.id, "bottom");
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-center gap-0.5">
                                <ArrowDown size={17} />
                            </div>
                        </button>
                    </div>

                    <div className="absolute -left-3 top-1/2 -translate-x-6 -translate-y-1/2 z-30">
                        <button
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                addBlock(block.id, "left");
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-center gap-0.5">
                                <ArrowLeft size={17} />
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Block;
