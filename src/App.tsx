import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import seoPages from "./data/seoPages.json";
import VisitorCenter from "./pages/VisitorCenter";
import Instructors from "./pages/Instructors";
import SkiPasses from "./pages/SkiPasses";
import Freeride from "./pages/Freeride";
import About from "./pages/About";
import AccommodationMap from "./pages/AccommodationMap";
import Hotels from "./pages/Hotels";
import NotFound from "./pages/NotFound";
import { AILoggerPanel } from "./components/AILoggerPanel";

const queryClient = new QueryClient();

const PageMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = seoPages.find((entry) => entry.path === pathname.replace(/\/$/, "") || entry.path === pathname);
    const title = page?.title ?? "Страница не найдена | Инфокурорт";
    const description = page?.description ?? "Запрошенная страница не найдена.";
    const canonicalPath = page?.path ?? pathname;
    const canonicalUrl = new URL(canonicalPath, "https://infokurort.ru").href;
    const imageUrl = "https://infokurort.ru/logo.png";
    const noIndex = !page;
    const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
    setMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex, follow" : "index, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageMetadata />
        <Routes>
          <Route path="/" element={<VisitorCenter />} />
          <Route path="/instruktory" element={<Instructors />} />
          <Route path="/ski-passes" element={<SkiPasses />} />
          <Route path="/freeride" element={<Freeride />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<AccommodationMap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* AI Logger только в dev режиме */}
      {import.meta.env.DEV && <AILoggerPanel />}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
