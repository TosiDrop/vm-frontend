import { useEffect, useState } from "react";
import { StakePoolInfo } from "src/entities/common.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getPools } from "src/services/common";

export default function usePools() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<StakePoolInfo[]>([]);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const pools = await getPools();
        setPools(pools);
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
