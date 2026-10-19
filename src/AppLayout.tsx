import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";
import seoPages from "./data/seoPages.json";
import VisitorCenter from "./pages/VisitorCenter";
import { Footer } from "./components/layout/Footer";
import { FloatingLeadButton } from "./components/FloatingLeadButton";
import { withTrailingSlash } from "./components/layout/nav";

export type PageComponents = Record<
  "Instructors" | "SkiPasses" | "Freeride" | "About" | "AccommodationMap" | "Hotels" | "NotFound",
  ComponentType
>;

const PageMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = seoPages.find((entry) => entry.path === withTrailingSlash(pathname));
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

/**
 * Общий каркас приложения. Его рендерят и браузер (BrowserRouter, ленивые страницы),
 * и пререндер при сборке (StaticRouter, обычные импорты) — разметка должна совпадать.
 */
export function AppLayout({ pages, children }: { pages: PageComponents; children?: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { Instructors, SkiPasses, Freeride, About, AccommodationMap, Hotels, NotFound } = pages;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
