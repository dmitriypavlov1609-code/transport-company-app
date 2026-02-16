import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import ClientLayout from './pages/client/ClientLayout';
import ClientDashboard from './pages/client/Dashboard';
import ClientCalculator from './pages/client/Calculator';
import ClientOrder from './pages/client/OrderWizard';
import ClientTracking from './pages/client/Tracking';
import ClientOrders from './pages/client/Orders';
import DriverLayout from './pages/driver/DriverLayout';
import DriverFeed from './pages/driver/Feed';
import DriverActiveRide from './pages/driver/ActiveRide';
import DriverEarnings from './pages/driver/Earnings';
import DispatcherLayout from './pages/dispatcher/DispatcherLayout';
import DispatcherDashboard from './pages/dispatcher/Dashboard';
import OperationsRevenue from './pages/operations/RevenueInsights';
import OperationsExport from './pages/operations/DataExport';
import AdminLayout from './pages/admin/AdminLayout';
import AdminAccounts from './pages/admin/Accounts';

// Global app context
export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser, userProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const user = currentUser && userProfile
    ? { role: userProfile.role, name: userProfile.name }
    : null;

  return (
    <AppContext.Provider value={{ user, darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors">
          <Routes>
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/client" element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ClientDashboard />} />
              <Route path="calculator" element={<ClientCalculator />} />
              <Route path="order" element={<ClientOrder />} />
              <Route path="tracking/:id" element={<ClientTracking />} />
              <Route path="orders" element={<ClientOrders />} />
            </Route>

            <Route path="/driver" element={
              <ProtectedRoute>
                <DriverLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DriverFeed />} />
              <Route path="active" element={<DriverActiveRide />} />
              <Route path="earnings" element={<DriverEarnings />} />
            </Route>

            <Route path="/dispatcher" element={
              <ProtectedRoute>
                <DispatcherLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DispatcherDashboard />} />
              <Route path="revenue" element={<OperationsRevenue />} />
              <Route path="export" element={<OperationsExport />} />
            </Route>

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DispatcherDashboard />} />
              <Route path="revenue" element={<OperationsRevenue />} />
              <Route path="export" element={<OperationsExport />} />
              <Route path="accounts" element={<AdminAccounts />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
