import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import './styles/index.scss';
import { AuthGuard, AuthProvider } from './feature/auth-provider';
import { RootStore, RootStoreProvider } from './models/root-store';
import { EmployeeDetail } from './pages/employee/employee-detail';
import { EmployeeList } from './pages/employee/employee-list';
import { LoginPage } from './pages/login/login';

function App() {
  const rootStore = new RootStore();

  return (
    <AuthProvider>
      <RootStoreProvider value={rootStore}>
        <Routes>
          <Route
            path="/employees"
            element={
              <AuthGuard>
                <EmployeeList />
              </AuthGuard>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <AuthGuard>
                <EmployeeDetail />
              </AuthGuard>
            }
          />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/employees" replace />} />
        </Routes>
      </RootStoreProvider>
    </AuthProvider>
  );
}

export default App;
