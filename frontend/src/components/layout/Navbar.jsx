import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { Search, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { API_CONFIG } from '@/config/apiConfig';
import httpClient from '@/lib/httpClient';
import { showErrorToast } from '@/utils/toast';
import BrandIdentity from '@/components/common/BrandIdentity';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
    const searchContainerRef = useRef(null);
    const displayName = user?.userName || user?.email || 'Profile';
    const initials = displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        setIsSearchPanelOpen(true);
        const term = query.trim();
        if (!term) {
            setResults([]);
            setSearchMessage('Enter a name, title, or source to search.');
            return;
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)) {
            setResults([]);
            setSearchMessage('');
            setIsSearchPanelOpen(false);
            navigate('/', { state: { emailSearch: term } });
            return;
        }

        setIsSearching(true);
        setSearchMessage('');
        try {
            const params = new URLSearchParams({ query: term, searchBy: 'all', pageNo: '1', pageSize: '20' });
            const response = await httpClient.request(`${API_CONFIG.ENDPOINTS.HOME}/search?${params}`);
            setResults(Array.isArray(response?.data) ? response.data : []);
            if (!response?.data?.length) setSearchMessage('No posts matched that search.');
        } catch (requestError) {
            setResults([]);
            setSearchMessage('');
            showErrorToast(requestError.message || 'Search is temporarily unavailable.');
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const closeSearchPanel = () => {
            setIsSearchPanelOpen(false);
            setResults([]);
            setSearchMessage('');
        };

        const handleOutsidePointerDown = (event) => {
            if (!searchContainerRef.current?.contains(event.target)) {
                closeSearchPanel();
            }
        };

        const handleSearchKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeSearchPanel();
            }
        };

        document.addEventListener('pointerdown', handleOutsidePointerDown);
        document.addEventListener('keydown', handleSearchKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handleOutsidePointerDown);
            document.removeEventListener('keydown', handleSearchKeyDown);
        };
    }, []);

    return (
        <nav className="app-navbar">
            <div className="container mx-auto min-h-16 px-3 py-2 sm:px-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <Link to="/" className="app-brand shrink-0" aria-label="Footprint home">
                    <BrandIdentity className="app-brand-identity" />
                </Link>
                <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-4">
                    <div className="navbar-search" ref={searchContainerRef}>
                        <form className="navbar-search__form" onSubmit={handleSearch} role="search">
                            <label className="sr-only" htmlFor="navbar-search-input">Search posts</label>
                            <input
                                id="navbar-search-input"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search posts..."
                            />
                            <Button type="submit" variant="ghost" size="icon" disabled={isSearching} aria-label="Search posts">
                                <Search size={18} />
                            </Button>
                        </form>
                        {isSearchPanelOpen && (searchMessage || results.length > 0) && (
                            <div className="navbar-search__results" aria-live="polite">
                                {searchMessage && <p className="navbar-search__message" role="status">{searchMessage}</p>}
                                {results.map((post) => (
                                    <Link
                                        className="navbar-search__result"
                                        to={`/post/${post.id}`}
                                        key={post.id}
                                        onClick={() => setIsSearchPanelOpen(false)}
                                    >
                                        <span>
                                            <strong>{post.title || 'Untitled post'}</strong>
                                            <small>{post.author || 'Footprint member'}</small>
                                        </span>
                                        <ArrowUpRight size={16} aria-hidden="true" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" asChild>
                        <Link to="/about">About</Link>
                    </Button>
                    {isAuthenticated ? (
                        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/profile" className="flex max-w-[38vw] items-center gap-2 sm:max-w-48">
                                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--app-brand-soft)] text-xs font-semibold text-[var(--app-brand)]" aria-hidden="true">
                                        {initials}
                                    </span>
                                    <span className="truncate">{displayName}</span>
                                </Link>
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
