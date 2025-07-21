import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, LoginRequest } from '../types';
import { authApi } from '../utils/api';

interface AuthContextType extends AuthState {
  login: (formData: LoginRequest) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setAuthState({
        isAuthenticated: true,
        user,
      });
    } catch {
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData: LoginRequest): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authApi.login(formData);
      
      if (response.success) {
        const user = await authApi.getCurrentUser();
        setAuthState({
          isAuthenticated: true,
          user,
        });
        return true;
      } else {
        setError(response.msg || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authApi.register({ username, password, email });
      
      if (response.success) {
        return true;
      } else {
        setError(response.msg || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
