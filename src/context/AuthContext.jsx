import { createContext, useContext, useState } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (username, password) => {
        try {
            const response = await auth.login(username, password);
            const { access, refresh, user: userData } = response.data;
            
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            const userWithAuth = { ...userData, isAuthenticated: true };
            localStorage.setItem('user', JSON.stringify(userWithAuth));
            
            setUser(userWithAuth);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user?.isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
