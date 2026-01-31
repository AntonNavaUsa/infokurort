import type { Hotel } from '../../types/accommodation.js';

/**
 * Data Normalizer Service
 * 
 * Приводит данные от разных OTA к единому формату Hotel
 */

/**
 * Нормализация отеля из Booking.com
 */
export function normalizeBookingHotel(raw: any, searchLat: number, searchLng: number): Hotel {
  return {
    id: `booking_${raw.hotel_id}`,
    externalId: raw.hotel_id.toString(),
    name: raw.hotel_name || 'Unknown Hotel',
    description: raw.hotel_description,
    coordinates: {
      lat: parseFloat(raw.latitude) || 0,
      lng: parseFloat(raw.longitude) || 0,
    },
    distance: calculateDistance(
      searchLat,
      searchLng,
      parseFloat(raw.latitude),
      parseFloat(raw.longitude)
    ),
    
    // Price
    price: parseFloat(raw.min_total_price) || 0,
    currency: raw.currency_code || 'USD',
    originalPrice: raw.original_price ? parseFloat(raw.original_price) : undefined,
    
    // Quality
    rating: normalizeRating(raw.review_score, 'booking'), // 0-10 scale
    reviewCount: parseInt(raw.review_nr) || 0,
    stars: parseInt(raw.class) || undefined,
    
    // Media
    imageUrl: raw.main_photo_url || '/placeholder-hotel.jpg',
    images: raw.photos?.map((p: any) => p.url_max) || [],
    
    // Source
    ota: 'booking',
    
    // Amenities
    amenities: raw.facilities?.map((f: any) => f.name) || [],
    roomType: raw.room_type_name,
    
    // Will be set by deeplink service
    deeplinkUrl: '',
  };
}

/**
 * Нормализация отеля из Expedia
 */
export function normalizeExpediaHotel(raw: any, searchLat: number, searchLng: number): Hotel {
  return {
    id: `expedia_${raw.hotelId}`,
    externalId: raw.hotelId.toString(),
    name: raw.name || 'Unknown Hotel',
    description: raw.shortDescription,
    coordinates: {
      lat: raw.coordinates?.latitude || 0,
      lng: raw.coordinates?.longitude || 0,
    },
    distance: calculateDistance(
      searchLat,
      searchLng,
      raw.coordinates?.latitude,
      raw.coordinates?.longitude
    ),
    
    price: raw.ratePlan?.price?.current || 0,
    currency: raw.ratePlan?.price?.currency || 'USD',
    originalPrice: raw.ratePlan?.price?.old,
    
    rating: normalizeRating(raw.guestReviews?.rating, 'expedia'),
    reviewCount: raw.guestReviews?.total || 0,
    stars: raw.starRating,
    
    imageUrl: raw.optimizedThumbUrls?.srpDesktop || '/placeholder-hotel.jpg',
    images: raw.media?.images?.map((i: any) => i.url) || [],
    
    ota: 'expedia',
    
    amenities: raw.amenities || [],
    
    deeplinkUrl: '',
  };
}

/**
 * Нормализация отеля из Agoda
 */
export function normalizeAgodaHotel(raw: any, searchLat: number, searchLng: number): Hotel {
  return {
    id: `agoda_${raw.id}`,
    externalId: raw.id.toString(),
    name: raw.name || 'Unknown Hotel',
    description: raw.description,
    coordinates: {
      lat: raw.location?.latitude || 0,
      lng: raw.location?.longitude || 0,
    },
    distance: calculateDistance(
      searchLat,
      searchLng,
      raw.location?.latitude,
      raw.location?.longitude
    ),
    
    price: raw.price?.amount || 0,
    currency: raw.price?.currency || 'USD',
    
    rating: normalizeRating(raw.rating, 'agoda'),
    reviewCount: raw.reviewCount || 0,
    stars: raw.stars,
    
    imageUrl: raw.image || '/placeholder-hotel.jpg',
    images: raw.images || [],
    
    ota: 'agoda',
    
    amenities: raw.facilities || [],
    
    deeplinkUrl: '',
  };
}

/**
 * Приведение рейтинга к шкале 0-10
 */
function normalizeRating(rating: number | undefined, source: string): number {
  if (!rating) return 0;

  switch (source) {
    case 'booking':
      // Booking.com uses 0-10 scale
      return Math.min(10, Math.max(0, rating));
    
    case 'expedia':
      // Expedia uses 0-5 scale
      return Math.min(10, Math.max(0, rating * 2));
    
    case 'agoda':
      // Agoda uses 0-10 scale
      return Math.min(10, Math.max(0, rating));
    
    default:
      return rating;
  }
}

/**
 * Расчёт расстояния между двумя точками (Haversine formula)
 * Возвращает расстояние в метрах
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // distance in meters
}

/**
 * Конвертация валют (простая реализация)
 * TODO: Использовать API курсов валют для точности
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  // Simplified rates (USD as base)
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    RUB: 92.5,
    CNY: 7.24,
  };

  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  return (amount / fromRate) * toRate;
}
