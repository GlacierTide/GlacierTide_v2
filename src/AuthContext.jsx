// frontend/src/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setUser({ userId });
        }
    }, []);

    const login = (userId) => {
        localStorage.setItem('userId', userId);
        setUser({ userId });
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('userId');
        setUser(null);
        navigate('/sign-in');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);