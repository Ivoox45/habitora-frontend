// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "@/components/theme-provider"; // 👈 NECESARIO

import AuthPage from "@/feature/auth/pages/AuthPage";
import LandingPage from "@/feature/landing/pages/LandingPage";
import Layout from "@/router/layout";

import { PropertiesPage } from "@/feature/properties/pages/PropertiesPage";
import { TenantsPage } from "@/feature/tenants/pages/TenantsPage";
import { ContractsPage } from "@/feature/contracts/pages/ContractsPage";
import { PaymentsPage } from "@/feature/payments/pages/PaymentsPage";
import { RemindersPage } from "@/feature/reminders/pages/RemindersPage";

import StartPage from "@/feature/start/pages/StartPage";
import OnboardingForm from "@/feature/start/components/OnboardingForm";
import WelcomeNewUser from "@/feature/start/components/WelcomeNewUser";

import ProtectedRoute from "@/router/ProtectedRoute";

// =============================================
//  Envuelto con AnimatePresence
// =============================================
function AppRouterInner() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ========= RUTAS PÚBLICAS ========= */}
        
       // SOLO Landing y Auth sin wrapper AnimatedPage

        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />



        {/* ========= RUTAS PROTEGIDAS ========= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/start" element={<StartPage />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/welcome" element={<WelcomeNewUser />} />

          {/* ========= LAYOUT PRINCIPAL ========= */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<AppHome />} />
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

// =============================================
//  APP ROUTER -> ENVUELTO EN THEME PROVIDER
// =============================================
export default function AppRouter() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="habitora-intranet-theme"
    >
      <BrowserRouter>
        <AppRouterInner />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// =============================================
//  HOME DEL PANEL
// =============================================
function AppHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Bienvenido a Habitora
      </h2>

      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Esto es solo contenido de prueba dentro del layout con sidebar.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
          <h3 className="font-semibold mb-1 text-zinc-900 dark:text-zinc-50">
            Módulo Propiedades
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Aquí iría la gestión de habitaciones, mini-depas, etc.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
          <h3 className="font-semibold mb-1 text-zinc-900 dark:text-zinc-50">
            Módulo Inquilinos
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Información de inquilinos, contratos y pagos.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-sm">
          <h3 className="font-semibold mb-1 text-zinc-900 dark:text-zinc-50">
            Reportes
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Resumen de ingresos, ocupación y métricas clave.
          </p>
        </div>
      </div>
    </div>
  );
}
