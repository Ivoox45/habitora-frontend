// src/router/AppRouter.tsx

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthPage from "@/feature/auth/pages/AuthPage";
import LandingPage from "@/feature/landing/pages/LandingPage";
import Layout from "@/router/layout";

import { PropertiesPage } from "@/feature/properties/pages/PropertiesPage";
import { TenantsPage } from "@/feature/tenants/pages/TenantsPage";
import { ContractsPage } from "@/feature/contracts/pages/ContractsPage";
import { PaymentsPage } from "@/feature/payments/pages/PaymentsPage";
import { RemindersPage } from "@/feature/reminders/pages/RemindersPage";
import { DashboardPage } from "@/feature/dashboard/pages";

import StartPage from "@/feature/start/pages/StartPage";
import OnboardingForm from "@/feature/start/components/OnboardingForm";
import WelcomeNewUser from "@/feature/start/components/WelcomeNewUser";

import ProtectedRoute from "@/router/ProtectedRoute";
import StartLayout from "@/feature/start/layout/StartLayout";
import AuthBootstrap from "@/router/AuthBootstrap";

function AppRouterInner() {
  const location = useLocation();

  // Guardar la última ruta visitada (solo rutas protegidas permanentes)
  useEffect(() => {
    // Solo guardar rutas del app y start, NO las de onboarding temporal
    if (location.pathname.startsWith('/app/') ||
      location.pathname === '/start') {
      try {
        localStorage.setItem('habitora-last-route', location.pathname);
      } catch { }
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          {/* Layout con HaloBackground compartido */}
          <Route element={<StartLayout />}>
            <Route path="start" element={<StartPage />} />
            <Route path="onboarding" element={<OnboardingForm />} />
            <Route path="welcome" element={<WelcomeNewUser />} />
          </Route>

          {/* PANEL PRINCIPAL */}
          <Route path="/app/:propertyId" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="habitaciones" element={<PropertiesPage />} />
            <Route path="inquilinos" element={<TenantsPage />} />
            <Route path="contratos" element={<ContractsPage />} />
            <Route path="pagos" element={<PaymentsPage />} />
            <Route path="recordatorios" element={<RemindersPage />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <AppRouterInner />
      </AuthBootstrap>
    </BrowserRouter>
  );
}
