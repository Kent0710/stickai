import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Header from "@/components/header";
import Main from "@/components/main";
import Footer from "@/components/footer";

export default async function LandingPage() {
    const session = await getServerSession(authOptions);
    return (
        <div className="bg-neutral-900 text-white">
            <Header isUserLoggedIn={session?.user === null ? true : false} />
            <Main />
            <Footer />
        </div>
    );
}
