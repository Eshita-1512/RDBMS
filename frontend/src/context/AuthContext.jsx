import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import api from '../api';

const AuthContext = createContext(null);

// Raw axios instance for login — bypasses the JSON Content-Type interceptor
const rawAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    // FastAPI OAuth2PasswordRequestForm requires application/x-www-form-urlencoded
    // We use rawAxios to avoid the interceptor overriding Content-Type to JSON
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const res = await rawAxios.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token } = res.data;
    localStorage.setItem('sb_token', access_token);

    // Fetch user profile using the authenticated api instance
    const userRes = await rawAxios.get('/users/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = userRes.data;
    localStorage.setItem('sb_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password, role_id: 3 });
  };

  const logout = () => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
