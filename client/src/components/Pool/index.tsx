import { PoolInfo } from "src/entities/vm.entities";

export default function Pool({ pool }: { pool: PoolInfo }) {
  return (
    <div className="background p-5 rounded-2xl flex flex-row gap-4">
      <div className="h-full w-14 flex items-center justify-center">
        <img alt="pool logo" className="w-full" src={pool.logo}></img>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="font-extrabold text-lg">
          [{pool.ticker}] {pool.name}
        </div>
        <div className="break-all">{pool.description}</div>
      </div>
    </div>
  );
}
