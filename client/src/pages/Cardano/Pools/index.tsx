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
        <p className="text-xl">
          Stake to TosiDrop team pools to support the devs and pay no TosiFee on
          claims
        </p>
        {pools.whitelistedPools.map((pool) => (
          <Pool key={pool.id} pool={pool}></Pool>
        ))}
        <p className="text-xl">Participating Pools</p>
        {pools.regularPools.map((pool) => (
          <Pool key={pool.id} pool={pool}></Pool>
        ))}
      </div>
    </>
  );
};

export default Pools;
