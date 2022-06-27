import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';

import {
  Routes,
  Route,
  HashRouter,
  Navigate,
} from "react-router-dom";

import MainSidebar from './components/main-sidebar';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';
import ReportsPage from './pages/Reports/OrdersPage';
import OrdersPage from './pages/OrdersPage';
import ExpensesPage from './pages/ExpensesPage';
import MainLayout from './pages/MainLayout';
import AuthProvider from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import RequireAuth from './pages/Auth/RequireAuth';
import PurchasesPage from './pages/PurchasesPage';
import useAuth from '../hooks/useAuth';

export interface AuthContextType {
  user: any;
  signin: (name: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

function HomePageAuth () {
  const auth:any = useAuth(AuthContext);

  console.log(auth?.user?.UserRole);

  if(auth?.user?.user?.UserRole?.name !== "Ventas") {
    return <Navigate to="/new-order" />
  }
  
  if(auth?.user?.user?.UserRole?.name !== "Compras") {
    return <Navigate to="/new-purchase" />
  }

  return <Navigate to="/reports" />
}

function render() {
  ReactDOM.render(
    <AuthProvider>
      <HashRouter>
        <div className={ classNames('wrapper') }>
            <MainSidebar />
            <Routes>
                <Route path="/settings/*" element={<RequireAuth permission='Administrador'><SettingsPage /></RequireAuth>} />
                <Route path="/reports" element={<RequireAuth permission='Reportes'><MainLayout><ReportsPage /></MainLayout></RequireAuth>} />
                <Route path="/new-order" element={<RequireAuth permission='Ventas'><MainLayout><OrdersPage /></MainLayout></RequireAuth>} />
                <Route path="/new-purchase" element={<RequireAuth permission='Compras'><MainLayout><PurchasesPage /></MainLayout></RequireAuth>} />
                <Route path="/new-expense" element={<RequireAuth permission='Ventas'><MainLayout><ExpensesPage /></MainLayout></RequireAuth>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePageAuth />} />
            </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
    , document.body);
}

render();