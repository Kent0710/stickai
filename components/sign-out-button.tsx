"use client";

import { signOut } from "next-auth/react";
import { IoLogOutOutline } from "react-icons/io5";
import { toast } from "sonner";

const SignOutButton = () => {
    return (
        <button
            onClick={() => {
                toast.loading("Signing out...");
                signOut({ callbackUrl: "http://localhost:3000/signIn" });
            }}
            className="flex items-center ml-2 gap-[5.5px] mt-1 hover:cursor-pointer"
        >
            <IoLogOutOutline size={19} />
            Logout
        </button>
    );
};

export default SignOutButton;
