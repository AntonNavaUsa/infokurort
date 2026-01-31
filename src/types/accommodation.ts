// TypeScript types for frontend

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AccommodationSearchParams {
  lat: number;
  lng: number;
  radius: number;
  type?: 'resort' | 'event' | 'city' | 'custom';
  checkin?: string;
  checkout?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface Hotel {
  id: string;
  externalId: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  distance: number;
  
  price: number;
  currency: string;
  originalPrice?: number;
  
  rating: number;
  reviewCount: number;
  stars?: number;
  
  imageUrl: string;
  images?: string[];
  
  ota: 'ostrovok' | 'sutochno' | '101hotels' | 'yandex';
  
  amenities?: string[];
  roomType?: string;
  
  deeplinkUrl: string;
}

export interface AccommodationSearchResponse {
  results: Hotel[];
  totalCount: number;
  searchParams: AccommodationSearchParams;
  cached: boolean;
  sources: string[];
}

export interface TrackClickRequest {
  widgetId: string;
  hotelId: string;
  hotelName: string;
  ota: string;
  price: number;
  currency: string;
}

export interface TrackClickResponse {
  success: boolean;
  clickId: string;
}

export interface WidgetConfig {
  widgetId?: string;
  lat: number;
  lng: number;
  radius?: number;
  type?: 'resort' | 'event' | 'city' | 'custom';
  theme?: 'light' | 'dark';
  primaryColor?: string;
  language?: 'ru' | 'en';
}
