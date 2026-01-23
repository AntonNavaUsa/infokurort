// Утилиты для работы с заявками на бронирование

export interface BookingDraft {
  id: string;
  timestamp: string;
  name?: string;
  phone?: string;
  email?: string;
  resort?: string;
  dates?: string;
  level?: string;
  category?: string;
  program?: string;
  days?: number;
  peopleCount?: number;
  specialRequests?: string;
}

const STORAGE_KEY = 'booking_drafts';

export function getBookings(): BookingDraft[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: BookingDraft): void {
  try {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    
    // Логируем для отладки
    console.log('📝 Новая заявка на бронирование:', booking);
    console.log(`✅ Всего заявок: ${bookings.length}`);
  } catch (error) {
    console.error('Ошибка при сохранении заявки:', error);
  }
}

export function clearBookings(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Все заявки удалены');
}

export function exportBookingsAsJSON(): string {
  const bookings = getBookings();
  return JSON.stringify(bookings, null, 2);
}

// Добавляем в window для доступа из консоли
if (typeof window !== 'undefined') {
  (window as any).bookings = {
    get: getBookings,
    clear: clearBookings,
    export: exportBookingsAsJSON,
  };
}
