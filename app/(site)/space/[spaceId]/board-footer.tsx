import { Square } from "lucide-react";
import React from "react";

interface BoardFooterProps {
    onAddNode: () => void;
}

const BoardFooter: React.FC<BoardFooterProps> = ({ onAddNode }) => {
    return (
        <footer className="lg:h-[9.5vh] flex items-center bg-neutral-200 rounded-lg text-neutral-600 py-3">
            <ul className="px-5 flex items-center space-x-3">
                <li className="cursor-pointer p-2 rounded-lg hover:bg-neutral-300" onClick={onAddNode}>
                    <Square size={30} />
                </li>
            </ul>
        </footer>
    );
};

export default BoardFooter;
