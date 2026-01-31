import type { AccommodationSearchParams, Hotel } from '../../types/accommodation.js';

interface OstrovokAPIResponse {
  // Define based on actual Ostrovok API response
  hotels: any[];
}

/**
 * Островок Affiliate API Service
 * 
 * Требуется регистрация в партнёрской программе Островок:
 * https://www.ostrovok.ru/partners/
 */
export class OstrovokService {
  private apiKey: string;
  private affiliateId: string;
  private baseUrl = 'https://api.ostrovok.ru/v1';

  constructor() {
    this.apiKey = process.env.OSTROVOK_API_KEY || '';
    this.affiliateId = process.env.OSTROVOK_AFFILIATE_ID || '';

    if (!this.apiKey) {
      console.warn('OSTROVOK_API_KEY not set in environment');
    }
  }

  /**
   * Поиск отелей по координатам
   */
  async searchByCoordinates(params: AccommodationSearchParams): Promise<Hotel[]> {
    if (!this.apiKey) {
      console.warn('Ostrovok API not configured');
      return [];
    }

    try {
      // TODO: Implement actual API call
      // const response = await fetch(
      //   `${this.baseUrl}/search/serp/`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Token ${this.apiKey}`,
      //     },
      //     body: JSON.stringify({
      //       latitude: params.lat,
      //       longitude: params.lng,
      //       radius: params.radius, // meters
      //     }),
      //   }
      // );

      // const data: OstrovokAPIResponse = await response.json();
      
      // Placeholder: возвращаем пустой массив
      return [];
      
      // TODO: Transform to Hotel[]
      // return this.normalizeResults(data.hotels);
    } catch (error) {
      console.error('Ostrovok API error:', error);
      return [];
    }
  }

  /**
   * Нормализация данных Островок к Hotel типу
   */
  private normalizeResults(rawHotels: any[]): Hotel[] {
    return rawHotels.map(hotel => ({
      id: `ostrovok_${hotel.id}`,
      externalId: hotel.id,
      name: hotel.name,
      description: hotel.description,
      coordinates: {
        lat: parseFloat(hotel.latitude),
        lng: parseFloat(hotel.longitude),
      },
      distance: 0, // TODO: calculate
      price: parseFloat(hotel.price?.amount || 0),
      currency: hotel.price?.currency || 'RUB',
      rating: hotel.rating || 0,
      reviewCount: hotel.reviews_count || 0,
      stars: hotel.stars || 0,
      imageUrl: hotel.photos?.[0] || '',
      images: hotel.photos || [],
      ota: 'ostrovok' as const,
      amenities: hotel.amenities || [],
      deeplinkUrl: this.generateDeeplink(hotel.id),
    }));
  }

  /**
   * Генерация affiliate deeplink
   */
  generateDeeplink(hotelId: string): string {
    const baseUrl = 'https://ostrovok.ru/hotel/';
    return `${baseUrl}${hotelId}?marker=${this.affiliateId}`;
  }
}

export const ostrovokService = new OstrovokService();
