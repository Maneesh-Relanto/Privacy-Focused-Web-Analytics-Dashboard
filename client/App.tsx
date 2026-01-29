import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TrackerTest from "./pages/tracker-test";
import MetricsTester from "./pages/MetricsTester";
import TestAdmin from "./pages/TestAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export const App = () => {
  // Determine basename based on environment
  const basename = import.meta.env.PROD
    ? "/Privacy-Focused-Web-Analytics-Dashboard/"
    : "/";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker-test" element={<TrackerTest />} />
            <Route path="/metrics-tester" element={<MetricsTester />} />
            <Route path="/test-admin" element={<TestAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
