import { useState, useEffect } from 'react';

// Remove the hardcoded API base URL since we're using Vite's proxy
// const API_BASE_URL = 'http://localhost:5000';

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
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { enabled = true, onSuccess, onError } = options;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use relative path since we're using Vite's proxy
        const response = await fetch(`/api${endpoint}`);
        const result: ApiResponse<T> = await response.json();

        if (!response.ok) {
          throw result;
        }

        if (isMounted) {
          setData(result.data);
          setError(null);
          onSuccess?.(result.data);
        }
      } catch (err) {
        if (isMounted) {
          const apiError = err as ApiError;
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, enabled]);

  return { data, error, isLoading };
}

export function useApiMutation<T, D = any>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { onSuccess, onError } = options;

  const mutate = async (payload: D, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST') => {
    try {
      setIsLoading(true);
      // Use relative path since we're using Vite's proxy
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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