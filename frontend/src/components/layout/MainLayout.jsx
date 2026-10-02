import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
    return (
        <div className="app-shell flex min-h-screen flex-col">
            <Navbar />
            <main className="app-main container mx-auto w-full flex-1 px-3 py-4 sm:px-4 sm:py-8">
                <Outlet />
            </main>
            <footer className="app-footer px-3 py-5 text-center text-xs sm:px-4 sm:py-6 sm:text-sm">
                © {new Date().getFullYear()} Footprint. Built with React & Shadcn UI.
            </footer>
        </div>
    );
};

export default MainLayout;
