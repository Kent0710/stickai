interface FooterProps {
    className? : string;
}

const Footer : React.FC<FooterProps> = ({
    className
}) => {
    return (
        <footer className={` py-10  lg:mt-[0rem] ${className} text-neutral-500`}>
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold">StickAI</h3>
                        <p className="mt-2 text-sm">
                            Turn your ideas into actionable insights with the power of AI.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <ul className="flex justify-center space-x-6">
                            <li>
                                <a
                                    href="/about"
                                    className="text-sm hover:underline"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/features"
                                    className="text-sm hover:underline"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-sm hover:underline"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/privacy"
                                    className="text-sm hover:underline"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6 pt-4 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} StickAI. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
