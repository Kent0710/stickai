import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

export default function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "15rem",
                    "--sidebar-width-mobile": "20rem",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            {/* w-full to take up the remaining space and adjust dynamically based on sidebar width  */}
            <main className="flex flex-col min-h-screen w-full ">
                <div className="flex gap-2 items-center w-full  m-2 border-b pb-2">
                    <SidebarTrigger />
                    <Input
                        placeholder="Search spaces..."
                        className="w-[40vw]"
                    />
                </div>
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    );
}
