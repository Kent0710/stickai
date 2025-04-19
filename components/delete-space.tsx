"use client";

import { AiOutlineDelete } from "react-icons/ai";
import { deleteSpace } from "@/actions/space-actions";
import React from "react";
import { toast } from "sonner";

interface DeleteSpaceProps {
    spaceId: string;
}

const DeleteSpace: React.FC<DeleteSpaceProps> = ({ spaceId }) => {
    const handleDelete = async () => {
        const toastId = toast.loading("Deleting space...");
        const result = await deleteSpace(spaceId);

        if (result.success) {
            toast.success("Space deleted successfully.", { id: toastId });
        } else {
            toast.error(result.error || "Failed to delete space.", {
                id: toastId,
            });
        }
    };

    return (
        <button
            className="flex items-center gap-2 -ml-0.5"
            onClick={handleDelete}
        >
            <AiOutlineDelete color="black" />
            Delete space
        </button>
    );
};

export default DeleteSpace;
