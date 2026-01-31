// Типы для модуля интерактивной карты размещения

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AccommodationSearchParams {
  lat: number;
  lng: number;
  radius: number; // meters
  type?: 'resort' | 'event' | 'city' | 'custom';
  checkin?: string; // ISO date
  checkout?: string; // ISO date
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number; // 0-10
}

export interface Hotel {
  id: string;
  externalId: string; // ID от OTA
  name: string;
  description?: string;
  coordinates: Coordinates;
  distance: number; // meters from search point
  
  // Pricing
  price: number;
  currency: string;
  originalPrice?: number; // if discounted
  
  // Quality
  rating: number; // 0-10
  reviewCount: number;
  stars?: number; // 1-5
  
  // Media
  imageUrl: string;
  images?: string[];
  
  // Source
  ota: 'ostrovok' | 'sutochno' | '101hotels' | 'yandex';
  
  // Amenities
  amenities?: string[];
  roomType?: string;
  
  // Affiliate
  deeplinkUrl: string;
}

export interface AccommodationSearchResponse {
  results: Hotel[];
  totalCount: number;
  searchParams: AccommodationSearchParams;
  cached: boolean;
  sources: string[]; // which OTAs were queried
}

// Widget models
export interface Widget {
  id: string;
  partnerId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  type: 'resort' | 'event' | 'city' | 'custom';
  
  // Customization
  theme?: 'light' | 'dark';
  primaryColor?: string;
  
  // Analytics
  totalViews: number;
  totalClicks: number;
  
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partner {
  id: string;
  email: string;
  name: string;
  domain: string;
  
  // Affiliate IDs
  ostrovokAffiliateId?: string;
  sutochnoAffiliateId?: string;
  hotelsAffiliateId?: string;  // 101Hotels
  yandexAffiliateId?: string;
  
  // Revenue
  commissionShare: number; // percentage
  
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Click {
  id: string;
  widgetId: string;
  partnerId: string;
  
  hotelId: string;
  hotelName: string;
  ota: string;
  price: number;
  currency: string;
  
  // Tracking
  ip?: string;
  userAgent?: string;
  referer?: string;
  
  clickedAt: Date;
}

export interface Conversion {
  id: string;
  partnerId: string;
  clickId?: string;
  
  bookingId: string;
  ota: string;
  hotelId: string;
  
  revenue: number;
  commission: number;
  currency: string;
  
  bookedAt: Date;
  checkinDate: Date;
  checkoutDate: Date;
  
  status: 'pending' | 'confirmed' | 'cancelled';
  
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
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

// Widget configuration
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

// Analytics types
export interface AnalyticsStats {
  totalClicks: number;
  totalWidgets: number;
  averageCTR: number;
  clicksByDay: Array<{
    date: string;
    clicks: number;
  }>;
  topWidgets: Array<{
    widgetId: string;
    widgetName: string;
    clicks: number;
    ctr: number;
  }>;
}
