import { useEffect, useState } from "react";
import { GetPoolsDto } from "src/entities/dto";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getPools } from "src/services/common";

export default function usePools() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<GetPoolsDto>({
    whitelistedPools: [],
    regularPools: [],
  });
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const getPoolsData = await getPools();
        setPools(getPoolsData);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pools,
    loading,
  };
}
