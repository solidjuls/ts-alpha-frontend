import React, { createContext, useContext, ReactNode } from 'react';
import { useIsAuthenticated } from '../hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: number;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProviderNew: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user: user || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProviderNew');
  }
  return context;
};

export default AuthProviderNew;
