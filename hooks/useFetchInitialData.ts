import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useFetchInitialData = ({ url }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(null);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      axios
        .get(url)
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
