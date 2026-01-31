import { useState, useEffect } from 'react';
import type { AccommodationSearchParams, Hotel } from '@/types/accommodation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UseAccommodationSearchResult {
  hotels: Hotel[];
  data: { results: Hotel[] } | null;
  loading: boolean;
  error: string | null;
  search: (params: AccommodationSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAccommodationSearch(
  initialParams?: AccommodationSearchParams
): UseAccommodationSearchResult {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<AccommodationSearchParams | undefined>(
    initialParams
  );

  const search = async (params: AccommodationSearchParams) => {
    setLoading(true);
    setError(null);
    setSearchParams(params);

    try {
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

      const data = await response.json();
      setHotels(data.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Accommodation search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    if (searchParams) {
      await search(searchParams);
    }
  };

  // Initial search if params provided
  useEffect(() => {
    if (initialParams) {
      search(initialParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    hotels,
    data: hotels.length > 0 ? { results: hotels } : null,
    loading,
    error,
    search,
    refetch,
  };
}
