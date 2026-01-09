import { useState, useCallback } from "react";
import apiClient from "../services/api";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  autoFetch?: boolean;
}

export const useApi = (url: string, options: UseApiOptions = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(url);
      setData(response.data);
      options.onSuccess?.(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, fetch };
};

export const usePost = (url: string, options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(
    async (payload: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(url, payload);
        options.onSuccess?.(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "An error occurred";
        setError(errorMessage);
        options.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { post, loading, error };
};

export const usePut = (url: string, options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = useCallback(
    async (payload: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put(url, payload);
        options.onSuccess?.(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "An error occurred";
        setError(errorMessage);
        options.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { put, loading, error };
};

export const useDelete = (url: string, options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(url);
      options.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { delete: delete_, loading, error };
};
