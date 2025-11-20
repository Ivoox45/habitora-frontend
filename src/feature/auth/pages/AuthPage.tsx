// src/feature/auth/pages/AuthPage.tsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { AnimatedPage } from "@/components/AnimatedPage";

type AuthLocationState = {
  mode?: "login" | "register";
};

export default function AuthPage() {
  const location = useLocation() as { state?: AuthLocationState };

  const initialIsLogin =
    location.state?.mode === "register" ? false : true;

  const [isLogin, setIsLogin] = useState(initialIsLogin);

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
