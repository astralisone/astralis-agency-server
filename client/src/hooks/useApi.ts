import { useState, useEffect, useCallback } from 'react';

// Define the API base URL - empty string for relative URLs
const API_BASE_URL = '';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface ApiError {
  status: 'error';
  message: string;
  errors?: any[];
}

interface UseApiOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { enabled = true, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Use the API_BASE_URL constant
      console.log(`Fetching data from: ${API_BASE_URL}/api${endpoint}`);
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
      const result: ApiResponse<T> = await response.json();
      console.log(`API response for ${endpoint}:`, result);

      if (!response.ok) {
        throw result;
      }

      setData(result.data);
      console.log(`Data set for ${endpoint}:`, result.data);
      setError(null);
      onSuccess?.(result.data);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Error fetching data from ${endpoint}:`, apiError);
      setError(apiError);
      setData(null);
      onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled, onSuccess, onError]);

  useEffect(() => {
    let isMounted = true;

    const fetchDataWithMountCheck = async () => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use the API_BASE_URL constant
        console.log(`Fetching data from: ${API_BASE_URL}/api${endpoint}`);
        const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
        const result: ApiResponse<T> = await response.json();
        console.log(`API response for ${endpoint}:`, result);

        if (!response.ok) {
          throw result;
        }

        if (isMounted) {
          setData(result.data);
          console.log(`Data set for ${endpoint}:`, result.data);
          setError(null);
          onSuccess?.(result.data);
        }
      } catch (err) {
        if (isMounted) {
          const apiError = err as ApiError;
          console.error(`Error fetching data from ${endpoint}:`, apiError);
          setError(apiError);
          setData(null);
          onError?.(apiError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDataWithMountCheck();

    return () => {
      isMounted = false;
    };
  }, [endpoint, enabled, onSuccess, onError]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch };
}

export function useApiMutation<T, D = any>(
  endpoint: string | ((param?: any) => string),
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { onSuccess, onError, method: defaultMethod = 'POST' } = options;

  const mutate = async (payload: D, param?: any, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = defaultMethod) => {
    try {
      setIsLoading(true);
      // Determine the endpoint
      const finalEndpoint = typeof endpoint === 'function' ? endpoint(param) : endpoint;
      
      // Use the API_BASE_URL constant
      const response = await fetch(`${API_BASE_URL}/api${finalEndpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't include body for DELETE requests or when payload is null
        ...(method !== 'DELETE' && payload !== null && { body: JSON.stringify(payload) }),
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw result;
      }

      setData(result.data);
      setError(null);
      onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setData(null);
      onError?.(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, error, isLoading };
} 