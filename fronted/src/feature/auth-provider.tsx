import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { httpClient, HttpServiceError } from '../services/http-service';

interface AuthContextType {
  isAuth: boolean;
  signIn: (username: string, password: string, callback?: () => void) => Promise<void>;
  signUp: (username: string, password: string, callback?: () => void) => Promise<void>;
  signOut: (callback: () => void) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const signIn = useCallback((username: string, password: string, callback?: () => void) => {
    return httpClient
      .post('/Auth', { username, password })
      .then(({ token }: { token: string; expiration: string }) => {
        localStorage.setItem('token', token);
        setIsAuth(true);
        navigate('/');

        if (callback) {
          callback();
        }
      });
  }, []);

  const signUp = useCallback((username: string, password: string, callback?: () => void) => {
    return httpClient.post('/Auth/register', { username, password }).then(() => {
      setIsAuth(true);

      if (callback) {
        callback();
      }
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuth(false);
  }, []);

  const unAuthErrorHandler = useCallback(
    ({ status }: HttpServiceError) => {
      if (status === '401') {
        signOut();
      }
    },
    [signOut]
  );

  useEffect(() => {
    httpClient.addErrorhandler(unAuthErrorHandler);

    return () => {
      httpClient.removeErrorHandler(unAuthErrorHandler);
    };
  }, [unAuthErrorHandler]);

  const value = { isAuth, signIn, signOut, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthGuard({ children }: { children: any }) {
  const location = useLocation();
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  return children;
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthProvider does not exist');
  }

  return authContext;
}
