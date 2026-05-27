import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="border-b bg-white dark:bg-zinc-950">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold">
                    PostIQ Social
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link to="/about">About</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
