import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider

import "./index.css";
import AuthProvider from "./Providers/AuthProvider";
import MainRoutes from "./Router/MainRoutes.jsx";

// Create a query client instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap everything inside the QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
