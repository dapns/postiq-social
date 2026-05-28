import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

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
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/profile">{user?.userName || user?.email || 'Profile'}</Link>
                            </Button>
                            <Button onClick={handleLogout}>Logout</Button>
                        </div>
                    ) : (
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
