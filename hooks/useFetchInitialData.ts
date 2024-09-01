import getAxiosInstance from "utils/axios";
import { useEffect, useRef, useState } from "react";

const useFetchInitialData = ({ url, cacheId }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(null);
  const cache = cacheId ? { id: cacheId } : undefined;
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getAxiosInstance()
        .get(url, cache)
        .then((resp) => {
          setData(resp.data);
          setIsLoading(false);
        })
        .catch((err) => setError(err));
    }
  }, []);

  return { data, isLoading, error };
};

export default useFetchInitialData;
