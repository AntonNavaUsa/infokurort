const STORAGE_KEY = "ik-first-touch";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = {
  landingPage?: string;
  referrer?: string;
} & Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Запоминает UTM и страницу входа на время визита, чтобы приложить их к заявке. */
export function captureFirstTouch() {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
    };
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 200);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage недоступен (приватный режим) — заявка уйдёт без атрибуции
  }
}

export function getFirstTouch(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
