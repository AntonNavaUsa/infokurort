/**
 * Deeplink Generator Service
 * 
 * Генерирует партнёрские ссылки для различных OTA с подстановкой affiliate ID
 */

interface DeeplinkParams {
  hotelId: string;
  ota: 'ostrovok' | 'sutochno' | '101hotels' | 'yandex';
  partnerId?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  utmSource?: string;
  utmCampaign?: string;
}

export class DeeplinkService {
  /**
   * Генерация партнёрской ссылки
   */
  generate(params: DeeplinkParams): string {
    switch (params.ota) {
      case 'ostrovok':
        return this.generateOstrovokLink(params);
      case 'sutochno':
        return this.generateSutochnoLink(params);
      case '101hotels':
        return this.generate101HotelsLink(params);
      case 'yandex':
        return this.generateYandexLink(params);
      default:
        throw new Error(`Unknown OTA: ${params.ota}`);
    }
  }

  /**
   * Островок deeplink
   * Format: https://ostrovok.ru/hotel/...?marker=PARTNER_ID
   */
  private generateOstrovokLink(params: DeeplinkParams): string {
    const affiliateId = process.env.OSTROVOK_AFFILIATE_ID || '';
    const baseUrl = `https://ostrovok.ru/hotel/${params.hotelId}`;
    
    const queryParams = new URLSearchParams();
    if (affiliateId) queryParams.set('marker', affiliateId);

    if (params.checkin) queryParams.set('guests', '1');
    if (params.checkout) queryParams.set('guests', '1');

    this.addUTMParams(queryParams, params);

    return queryParams.toString() 
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  }

  /**
   * Суточно.ру deeplink
   * Format: https://sutochno.ru/...?partner_id=PARTNER_ID
   */
  private generateSutochnoLink(params: DeeplinkParams): string {
    const affiliateId = process.env.SUTOCHNO_AFFILIATE_ID || '';
    const baseUrl = `https://sutochno.ru/${params.hotelId}`;
    
    const queryParams = new URLSearchParams();
    if (affiliateId) queryParams.set('partner_id', affiliateId);

    this.addUTMParams(queryParams, params);

    return queryParams.toString() 
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  }

  /**
   * 101Hotels deeplink
   */
  private generate101HotelsLink(params: DeeplinkParams): string {
    const affiliateId = process.env.HOTELS_101_AFFILIATE_ID || '';
    const baseUrl = `https://101hotels.com/main/cities/hotel/${params.hotelId}`;
    
    const queryParams = new URLSearchParams();
    if (affiliateId) queryParams.set('aff_id', affiliateId);

    this.addUTMParams(queryParams, params);

    return queryParams.toString() 
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  }

  /**
   * Яндекс Путешествия deeplink
   */
  private generateYandexLink(params: DeeplinkParams): string {
    const affiliateId = process.env.YANDEX_AFFILIATE_ID || '';
    const baseUrl = `https://travel.yandex.ru/hotels/${params.hotelId}`;
    
    const queryParams = new URLSearchParams();
    if (affiliateId) queryParams.set('clid', affiliateId);

    this.addUTMParams(queryParams, params);

    return queryParams.toString() 
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  }

  /**
   * Добавление UTM параметров для аналитики
   */
  private addUTMParams(queryParams: URLSearchParams, params: DeeplinkParams) {
    if (params.utmSource) {
      queryParams.set('utm_source', params.utmSource);
    } else {
      queryParams.set('utm_source', 'ski-concierge-widget');
    }

    if (params.utmCampaign) {
      queryParams.set('utm_campaign', params.utmCampaign);
    }

    queryParams.set('utm_medium', 'affiliate');
  }
}

export const deeplinkService = new DeeplinkService();
