import getAxiosInstance from "utils/axios";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";

interface FetchParams {
  url: string;
  cacheId?: string;
}

const useFetchInitialData = <T>({ url, cacheId }: FetchParams) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const isMounted = useRef(false);
  const cache = cacheId ? { id: cacheId } : undefined;

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAxiosInstance().get<T>(url, cache);
      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchData();
    }
  }, []);

  return { data, setData, isLoading, error, refetch: fetchData };
};

export default useFetchInitialData;
