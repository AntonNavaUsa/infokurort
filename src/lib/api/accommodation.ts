import type { AccommodationSearchParams, TrackClickRequest } from '@/types/accommodation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API client для модуля размещения
 */
class AccommodationAPI {
  /**
   * Поиск отелей по координатам
   */
  async searchAccommodation(params: AccommodationSearchParams) {
    const response = await fetch(`${API_URL}/accommodation/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Получить детали отеля
   */
  async getHotelDetails(id: string) {
    const response = await fetch(`${API_URL}/accommodation/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to get hotel details: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Трекинг клика по affiliate ссылке
   */
  async trackClick(data: TrackClickRequest) {
    const response = await fetch(`${API_URL}/affiliate/track-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Don't throw on tracking errors, just log
      console.error('Failed to track click:', response.statusText);
      return { success: false };
    }

    return response.json();
  }

  /**
   * Получить deeplink для бронирования
   */
  async getDeeplink(hotelId: string, ota: string, partnerId: string): Promise<string> {
    const params = new URLSearchParams({ hotelId, ota, partnerId });
    const response = await fetch(`${API_URL}/affiliate/deeplink?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to generate deeplink: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url;
  }
}

export const accommodationAPI = new AccommodationAPI();
