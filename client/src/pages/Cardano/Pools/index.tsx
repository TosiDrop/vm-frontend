import { useEffect, useState } from "react";
import Pool from "src/components/Pool";
import { StakePoolInfo } from "src/entities/common.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getPools } from "src/services/common";

const Pools = () => {
  const { handleError } = useErrorHandler();
  const [pools, setPools] = useState<StakePoolInfo[]>([]);

  const fetchPools = async () => {
    try {
      const pools = await getPools();
      setPools(pools);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchPools();
  });

  return (
    <>
      <p className="text-3xl">Participating Pools</p>
      <div className="flex flex-col gap-4">
        {pools.map((pool) => (
          <Pool key={pool.ticker} pool={pool}></Pool>
        ))}
      </div>
    </>
  );
};

export default Pools;
