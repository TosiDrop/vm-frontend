import { PoolInfo } from "src/entities/vm.entities";
import useStakeToPool from "src/hooks/cardano/useStakeToPool";
import Spinner from "../Spinner";

export default function Pool({ pool }: { pool: PoolInfo }) {
  const { stakeToPool, loading } = useStakeToPool();

  return (
    <div className="background p-5 rounded-2xl flex flex-row gap-4">
      <div className="h-full w-14 flex items-center justify-center">
        <img alt="pool logo" className="w-full" src={pool.logo}></img>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="font-extrabold text-lg flex flex-row items-center gap-2">
          [{pool.ticker}] {pool.name}{" "}
          <button
            className="rounded-lg px-2.5 h-full font-normal text-sm tosi-button flex flex-row gap-2 items-center"
            onClick={() => stakeToPool(pool.id)}
          >
            delegate
            {loading ? <Spinner></Spinner> : null}
          </button>
        </div>
        <div className="break-all">{pool.description}</div>
      </div>
    </div>
  );
}
