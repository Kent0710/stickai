import SignOutButton from "./sign-out-button";
import { Button } from "./ui/button";
import Link from "next/link";

import stickailogo from "@/public/stickai-logo.webp";
import Image from "next/image";

interface HeaderProps {
    isUserLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isUserLoggedIn }) => {
    return (
        <header className="w-full pt-8 pb-4 px-16 flex justify-between items-center">
            <span className="flex items-center gap-2">
                <Image src={stickailogo} alt="stickai-logo" className="w-10" />
                <h1> StickAI </h1>
            </span>
            <nav className="flex items-center gap-6">
                <ul className="hidden sm:flex gap-6">
                    <li>Features</li>
                    <li> Contact </li>
                    <li>Privacy</li>
                    <li>About</li>
                </ul>
                {isUserLoggedIn ? (
                    <SignOutButton />
                ) : (
                    <Link href="/signIn">
                        <Button> Sign up </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
