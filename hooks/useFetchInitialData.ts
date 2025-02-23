import getAxiosInstance from "utils/axios";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";

interface FetchParams {
  url: string;
  cacheId?: string;
}

const useFetchInitialData = <T,>({ url, cacheId }: FetchParams) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const isMounted = useRef(false);
  const cache = cacheId ? { id: cacheId } : undefined;
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getAxiosInstance()
        .get<T>(url, cache)
        .then((resp) => {
          setData(resp.data);
          setIsLoading(false);
        })
        .catch((err: AxiosError) => setError(err));
    }
  }, []);

  return { data, isLoading, error };
};

export default useFetchInitialData;
