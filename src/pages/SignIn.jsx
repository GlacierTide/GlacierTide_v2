// frontend/src/pages/SignIn.jsx
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        console.log('Sending to backend:', { email: trimmedEmail, password: trimmedPassword });

        try {
            const response = await fetch('http://localhost:8800/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            login(data.userId); // Always log in with context
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
            <div className="page-transition">
                <section className="min-h-screen-minus-nav flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 mt-4 flex items-center justify-center p-8">
                        <div className="max-w-md w-full">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
                                <p className="text-gray-500">Sign in to continue your scientific exploration</p>
                            </div>

                            <div className="glacier-card p-8">
                                {error && <p className="text-red-600 mb-4">{error}</p>}
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-gray-500 mb-2 font-medium">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="glacier-input w-full"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="password" className="block text-gray-500 font-medium">
                                                    Password
                                                </label>
                                                <Link to="/forgot-password" className="text-sm text-glacier-600 hover:text-glacier-700">
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="glacier-input w-full pr-10"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                                className="h-4 w-4 text-glacier-600 rounded border-ice-300 focus:ring-glacier-500"
                                            />
                                            <label htmlFor="remember" className="ml-2 block text-gray-600">
                                                Remember me
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-glacier-600 text-white px-4 py-2 rounded hover:bg-glacier-700 w-full flex items-center justify-center transition"
                                        >
                                            <LogIn className="mr-2 h-5 w-5" />
                                            Sign In
                                        </button>

                                        <p className="text-center text-gray-500">
                                            Don't have an account?{' '}
                                            <Link to="/sign-up" className="text-glacier-600 hover:text-glacier-700 font-medium">
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block w-1/2 h-[680px] mt-4 bg-gradient-to-br from-glacier-400 to-glacier-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-glacier-pattern opacity-10"></div>
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-flow"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-flow" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                            <h2 className="text-3xl font-bold mb-6 text-center">Explore Earth's Frozen Wonders</h2>
                            <p className="text-lg text-center max-w-md mb-8">
                                Join our community of enviromental enthusiasts dedicated to understanding and preserving glaciers.
                            </p>
                            <Link to="/about" className="inline-flex items-center text-white group">
                                Learn more about our mission
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default SignIn;