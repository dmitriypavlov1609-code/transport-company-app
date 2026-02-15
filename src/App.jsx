import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
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

// Global app context
export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [user, setUser] = useState(null); // { role: 'client'|'driver'|'dispatcher', name }
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppContext.Provider value={{ user, setUser, darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="calculator" element={<ClientCalculator />} />
              <Route path="order" element={<ClientOrder />} />
              <Route path="tracking/:id" element={<ClientTracking />} />
              <Route path="orders" element={<ClientOrders />} />
            </Route>

            <Route path="/driver" element={<DriverLayout />}>
              <Route index element={<DriverFeed />} />
              <Route path="active" element={<DriverActiveRide />} />
              <Route path="earnings" element={<DriverEarnings />} />
            </Route>

            <Route path="/dispatcher" element={<DispatcherLayout />}>
              <Route index element={<DispatcherDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}
