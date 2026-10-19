import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import seoPages from "./data/seoPages.json";
import VisitorCenter from "./pages/VisitorCenter";
import { Footer } from "./components/layout/Footer";
import { FloatingLeadButton } from "./components/FloatingLeadButton";

const Instructors = lazy(() => import("./pages/Instructors"));
const SkiPasses = lazy(() => import("./pages/SkiPasses"));
const Freeride = lazy(() => import("./pages/Freeride"));
const About = lazy(() => import("./pages/About"));
const AccommodationMap = lazy(() => import("./pages/AccommodationMap"));
const Hotels = lazy(() => import("./pages/Hotels"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AILoggerPanel = lazy(() => import("./components/AILoggerPanel").then((m) => ({ default: m.AILoggerPanel })));

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

// Прокрутка наверх при смене страницы и к якорю (#podbor, #calculator), в том числе на лениво загруженных страницах
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let attempts = 0;
    const timer = window.setInterval(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target || ++attempts > 40) {
        window.clearInterval(timer);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
};

const PageFallback = () => <div className="min-h-[60vh]" aria-busy="true" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageMetadata />
        <ScrollManager />
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
        <Footer />
        <FloatingLeadButton />
      </BrowserRouter>
      {/* AI Logger только в dev режиме */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <AILoggerPanel />
        </Suspense>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
