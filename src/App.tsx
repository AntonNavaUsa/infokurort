import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Instructors from "./pages/Instructors";
import SkiPasses from "./pages/SkiPasses";
import Freeride from "./pages/Freeride";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { AILoggerPanel } from "./components/AILoggerPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Instructors />} />
          <Route path="/ski-passes" element={<SkiPasses />} />
          <Route path="/freeride" element={<Freeride />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* AI Logger только в dev режиме */}
      {import.meta.env.DEV && <AILoggerPanel />}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
