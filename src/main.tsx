// src/main.tsx (o src/index.tsx)
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "@/router/AppRouter";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      {/* Toaster global para toda la app */}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
