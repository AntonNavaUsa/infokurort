import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureFirstTouch } from "./lib/attribution";
import "./lib/ai/bookings"; // Инициализируем bookings utilities

captureFirstTouch();

const container = document.getElementById("root")!;

// Публичные страницы приходят с готовым HTML из пререндера — гидрируем его.
// Страницы без пререндера (карта, dev-сервер) рендерим с нуля.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
