// Точка входа пререндера: собирается `vite build --ssr` и вызывается из scripts/generate-seo-pages.mjs.
// Страницы импортируются напрямую (без lazy), чтобы renderToString отдал готовый HTML.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppLayout, type PageComponents } from "./AppLayout";
import Instructors from "./pages/Instructors";
import SkiPasses from "./pages/SkiPasses";
import Freeride from "./pages/Freeride";
import About from "./pages/About";
import Hotels from "./pages/Hotels";
import NotFound from "./pages/NotFound";

const pages: PageComponents = {
  Instructors,
  SkiPasses,
  Freeride,
  About,
  // Карта (Leaflet) работает только в браузере: маршрут не пререндерится, отдаётся пустая оболочка
  AccommodationMap: () => null,
  Hotels,
  NotFound,
};

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AppLayout pages={pages} />
    </StaticRouter>,
  );
}
