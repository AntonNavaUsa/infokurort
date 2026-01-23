import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/ai/bookings"; // Инициализируем bookings utilities

createRoot(document.getElementById("root")!).render(<App />);
