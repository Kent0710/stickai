import Link from "next/link";
import { Button } from "./ui/button";

import { RxCaretRight } from "react-icons/rx";

import Image from "next/image";
import googleapaclogo from "@/public/googleapaclogo.webp";

const Main = () => {
    return (
        <>
            <main className="flex flex-wrap justify-center px-[4rem]  gap-4 mb-[7rem] mt-4">
                <section className="space-y-6 w-[60%]">
                    <h2 className="text-5xl lg:text-8xl font-extrabold text-center lg:text-left rounded-2xl  bg-yellow-500">
                        <span className="text-2xl lg:text-5xl font-semibold bg-blue-400 rounded-2xl px-5 mx-5">
                            The Future of
                        </span>{" "}
                        <br />
                        AI-Assisted Brainstorming
                    </h2>
                    <h3 className="text-5xl font-bold text-blue-300">
                        Transform scattered ideas into structured insights with
                        AI, work solo or in teams.
                    </h3>
                    <div className="space-x-3 text-center lg:text-left">
                        <Link href={"/home"}>
                            {" "}
                            <Button
                                variant={"special"}
                                className="text-4xl px-10 py-10 font-mono"
                            >
                                Get started{" "}
                            </Button>{" "}
                        </Link>
                        <Button className="border  hover:underline hover:bg-neutral-800 bg-transparent ">
                            See guide and documentation
                            <RxCaretRight />
                        </Button>
                    </div>
                </section>
                <section className="w-[35%] h-[30rem] z-1 bg-orange-500  rounded-t-full relative overflow-visible">
                    <iframe
                        className="w-[23rem] h-[23rem] lg:w-[35rem] lg:h-[40rem] -mb-40 " // 👈 adjust -mb to control overlap
                        src="https://lottie.host/embed/fac3b5d9-0951-4ef5-aece-532c4d3f40df/63F0iIlFws.lottie"
                    ></iframe>
                </section>
            </main>

            <section className="px-[2rem] mb-8 bg-violet-300">
                <div className="flex items-center gap-2">
                    <Link
                        href={"https://gdg.community.dev/"}
                        className="flex flex-col items-center justify-center transition-all hover:cursor-pointer bg-yellow-300 rounded-lg"
                    >
                        <Image
                            src={googleapaclogo}
                            alt="googleapaclogo"
                            className="w-[30rem]"
                        />
                        <h3 className="text-4xl font-extrabold text-white underline">
                            Google Developer Group
                        </h3>
                    </Link>
                    <span>
                        <h3 className="text-9xl font-extrabold text-neutral-600">
                            Part of{" "}
                            <span className="bg-white rounded-2xl">
                                <span className="text-[#4285F4]">G</span>
                                <span className="text-[#DB4437]">o</span>
                                <span className="text-[#F4B400]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#0F9D58]">l</span>
                                <span className="text-[#DB4437]">e</span>
                            </span>{" "}
                            Solution Challenge
                        </h3>
                        <h3 className="text-4xl bg-blue-700 rounded-lg w-fit">
                            {" "}
                            AI for a better tomorrow{" "}
                        </h3>
                    </span>
                </div>
            </section>

        </>
    );
};
export default Main;