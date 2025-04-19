import { getSpace } from "@/actions/space-actions";
import React from "react";

import { ReactFlowProvider } from "@xyflow/react";
import Board from "./board";
import BoardHeader from "./board-header";
import AISidebar from "./ai-sidebar";

interface SpaceWrapperProps {
    spaceId: string;
}

const SpaceWrapper: React.FC<SpaceWrapperProps> = async ({ spaceId }) => {
    const space = await getSpace(spaceId);

    if (!space.success || !space.space) {
        return <div>Error loading space</div>;
    }

    return (
        <div className="flex w-full h-full">
            <section className="flex flex-col space-y-2 w-full h-full overflow-hidden">
                <BoardHeader className="flex justify-between items-center mx-1.5" />
                <ReactFlowProvider>
                    <div className="flex-grow">
                    <Board 
    spaceId={space.space.id} 
    initialBlocks={space.blocks} 
    initialArrows={space.arrows}
/>
                    </div>
                </ReactFlowProvider>
            </section>
            <AISidebar className="space-y-2 lg:h-[85dvh] w-[30vw] mr-4" />
        </div>
    );
};

export default SpaceWrapper;
