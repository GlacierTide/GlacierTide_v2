// frontend/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false); // Close mobile menu on route change
    }, [location]);

    const isActive = (path) => location.pathname === path;

    // Define which routes need authentication
    const protectedRoutes = ['/prediction-tool', '/globe'];
    
    // Handle navigation to protected routes
    const handleNavigation = (path) => {
        if (protectedRoutes.includes(path) && !user) {
            toast.error('Please sign in to access this feature', {
                duration: 3000,
                position: 'top-center',
            });
            navigate('/sign-in', { state: { from: path } });
        } else {
            navigate(path);
        }
    };

    const navLinks = [
        { name: 'About', path: '/about', protected: false },
        { name: 'World Map', path: '/world-map', protected: false },
        { name: 'Prediction Tool', path: '/prediction-tool', protected: true },
        { name: 'Globe', path: '/globe', protected: true },
        { name: 'Contact', path: '/contact', protected: false },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/80 backdrop-blur-lg shadow-md py-3' 
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link 
                    to="/" 
                    className="flex items-center space-x-2 text-black font-bold text-3xl"
                >
                    {/* Logo Icon */}
                    <img 
                        src="logo1.ico" 
                        alt="GlacierTide Logo" 
                        className="h-12 w-14 mb-2"
                    />
                    <span><span className="text-glacier-600">Glacier</span>Tide</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => handleNavigation(link.path)}
                            className={`nav-link ${isActive(link.path) ? 'active-nav-link' : ''}`}
                        >
                            {link.name}
                            {link.protected && !user && (
                                <span className="ml-1 text-xs text-glacier-500">•</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Auth Buttons - Desktop */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <button
                            onClick={logout}
                            className="bg-glacier-600 text-white px-4 py-2 rounded hover:bg-glacier-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link 
                                to="/sign-in" 
                                className="text-black hover:text-glacier-600 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/sign-up" 
                                className="btn-primary"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-ice-800 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden glacier-glass animate-fade-in-down">
                    <div className="container mx-auto px-4 pt-2 pb-6 flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNavigation(link.path)}
                                className={`block py-2 px-4 text-lg font-medium rounded-lg ${
                                    isActive(link.path)
                                        ? 'bg-glacier-100/50 text-glacier-700'
                                        : 'text-ice-800 hover:bg-white/20'
                                }`}
                            >
                                {link.name}
                                {link.protected && !user && (
                                    <span className="ml-1 text-xs text-glacier-500">•</span>
                                )}
                            </button>
                        ))}
                        <div className="flex flex-col space-y-3 pt-3">
                            {user ? (
                                <button
                                    onClick={logout}
                                    className="bg-glacier-600 text-white px-4 py-2 rounded hover:bg-glacier-700 transition w-full text-center"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link 
                                        to="/sign-in" 
                                        className="btn-outline w-full text-center"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/sign-up" 
                                        className="btn-primary w-full text-center"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
