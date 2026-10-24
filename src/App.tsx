import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout, type PageComponents } from "./AppLayout";

const pages: PageComponents = {
  Instructors: lazy(() => import("./pages/Instructors")),
  InstructorTopics: lazy(() => import("./pages/InstructorTopics")),
  SkiPasses: lazy(() => import("./pages/SkiPasses")),
  Freeride: lazy(() => import("./pages/Freeride")),
  About: lazy(() => import("./pages/About")),
  AccommodationMap: lazy(() => import("./pages/AccommodationMap")),
  Hotels: lazy(() => import("./pages/Hotels")),
  ReferenceGuides: lazy(() => import("./pages/ReferenceGuides")),
  NotFound: lazy(() => import("./pages/NotFound")),
};

const AILoggerPanel = lazy(() => import("./components/AILoggerPanel").then((m) => ({ default: m.AILoggerPanel })));

const App = () => (
  <BrowserRouter>
    <AppLayout pages={pages}>
      {/* AI Logger только в dev режиме */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <AILoggerPanel />
        </Suspense>
      )}
    </AppLayout>
  </BrowserRouter>
);

export default App;
