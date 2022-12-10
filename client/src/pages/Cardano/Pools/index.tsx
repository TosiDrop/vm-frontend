import Pool from "src/components/Pool";
import usePools from "src/hooks/cardano/pools/usePools";
import Loading from "src/pages/Loading";

const Pools = () => {
  const { pools, loading } = usePools();

  return loading ? (
    <Loading></Loading>
  ) : (
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
