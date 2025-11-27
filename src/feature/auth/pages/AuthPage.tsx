// src/feature/auth/pages/AuthPage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useAuthStore } from "@/store/useAuthStore";

type AuthLocationState = {
  mode?: "login" | "register";
};

export default function AuthPage() {
  const location = useLocation() as { state?: AuthLocationState };
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const initialIsLogin =
    location.state?.mode === "register" ? false : true;

  const [isLogin, setIsLogin] = useState(initialIsLogin);

  // Si ya está autenticado, redirigir a la última ruta guardada o al dashboard
  // PERO NO interferir con el flujo de onboarding de nuevos usuarios
  useEffect(() => {
    if (isAuthenticated) {
      try {
        // Verificar si es un nuevo usuario que acaba de registrarse
        const isNewUser = sessionStorage.getItem('habitora-new-user') === 'true';
        
        // Si es nuevo usuario, NO redirigir (dejar que vaya a /welcome)
        if (isNewUser) {
          return;
        }
        
        const lastRoute = localStorage.getItem('habitora-last-route');
        if (lastRoute && lastRoute !== '/' && lastRoute !== '/auth') {
          navigate(lastRoute, { replace: true });
        } else {
          // Si no hay última ruta, redirigir al dashboard por defecto
          navigate('/start', { replace: true });
        }
      } catch {
        navigate('/start', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <AnimatedPage>
      <div className="w-full h-screen overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{
                duration: 0.5,
                ease: [0.45, 0, 0.55, 1],
              }}
              className="w-full h-full"
            >
              <LoginForm onToggle={() => setIsLogin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                duration: 0.5,
                ease: [0.45, 0, 0.55, 1],
              }}
              className="w-full h-full"
            >
              <RegisterForm onToggle={() => setIsLogin(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
