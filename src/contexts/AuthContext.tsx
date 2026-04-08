import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { ROLES } from '../constants/roles';
import { AuthContext, type AuthContextValue, type AuthUser, type RegisterPayload } from './AuthContextBase';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (e: unknown) => {
    const maybe = e as { response?: { data?: { message?: string } } };
    return maybe?.response?.data?.message || 'Erreur';
  };

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw && !user) {
      setUser(JSON.parse(raw));
    }
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((next: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || 'Connexion échouée');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || 'Inscription échouée');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role;
    return {
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      updateUser,
      isStudent: role === ROLES.STUDENT,
      isTeacher: role === ROLES.TEACHER,
      isAdmin: role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN,
      isSuperAdmin: role === ROLES.SUPER_ADMIN,
    };
  }, [user, loading, error, login, logout, register, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
