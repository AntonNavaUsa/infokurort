import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureFirstTouch } from "./lib/attribution";
import "./lib/ai/bookings"; // Инициализируем bookings utilities

captureFirstTouch();

createRoot(document.getElementById("root")!).render(<App />);
