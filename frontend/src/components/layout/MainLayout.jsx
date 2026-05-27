import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t py-6 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} PostIQ Social. Built with React & Shadcn UI.
            </footer>
        </div>
    );
};

export default MainLayout;
