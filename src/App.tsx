import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import ClientDashboard from './pages/client/Dashboard';
import Documents from './pages/client/Documents';
import YourInformation from './pages/client/Intake';
import Communication from './pages/client/Communication';
import Billing from './pages/client/Billing';
import StaffDashboard from './pages/staff/Dashboard';

function RoleBasedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'client' | 'staff' }) {
  const { userRole } = useAppContext();
  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'client' ? '/' : '/staff'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Client Routes */}
        <Route index element={
          <RoleBasedRoute allowedRole="client">
            <ClientDashboard />
          </RoleBasedRoute>
        } />
        <Route path="documents" element={
          <RoleBasedRoute allowedRole="client">
            <Documents />
          </RoleBasedRoute>
        } />
        <Route path="intake" element={
          <RoleBasedRoute allowedRole="client">
            <YourInformation />
          </RoleBasedRoute>
        } />
        <Route path="communication" element={
          <RoleBasedRoute allowedRole="client">
            <Communication />
          </RoleBasedRoute>
        } />
        <Route path="billing" element={
          <RoleBasedRoute allowedRole="client">
            <Billing />
          </RoleBasedRoute>
        } />

        {/* Staff Routes */}
        <Route path="staff" element={
          <RoleBasedRoute allowedRole="staff">
            <StaffDashboard />
          </RoleBasedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
