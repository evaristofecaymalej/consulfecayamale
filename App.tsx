
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import CreateDocument from './pages/CreateDocument';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PublicVerification from './pages/PublicVerification';
import Login from './pages/Login';
import Products from './pages/Products';
import CashFlow from './pages/CashFlow';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactElement, allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { currentUser } = useAppContext();
  
  const isAuthenticated = !!currentUser && localStorage.getItem('faturfeca_auth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />; // Redirect if role not allowed
  }

  return children;
};


function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:documentId" element={<PublicVerification />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/new/:docType" element={<CreateDocument />} />
            <Route path="documents/:documentId" element={<DocumentDetail />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="cash-flow" element={
              <ProtectedRoute allowedRoles={[UserRole.Administrador, UserRole.Contabilista]}>
                <CashFlow />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={[UserRole.Administrador, UserRole.Contabilista]}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={[UserRole.Administrador]}>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
