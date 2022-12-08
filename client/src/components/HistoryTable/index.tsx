import { ParsedReward } from "src/entities/common.entities";
import { normalizeAmount } from "src/utils";

export default function HistoryTable({
  claimHistory,
}: {
  claimHistory: ParsedReward[];
}) {
  return claimHistory.length ? (
    <table className="background rounded-2xl p-5 table-fixed border-separate text-left">
      <thead className="border-b">
        <tr>
          <th className="w-2/12">Date/Time</th>
          <th className="w-4/12">Token</th>
          <th className="w-4/12">Amount</th>
        </tr>
      </thead>
      <tbody className="align-top">
        {claimHistory.map((reward, i) => {
          const date = new Date(reward.delivered_on + "+0100");
          return (
            <tr key={i}>
              <td>
                <div>
                  {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
                </div>
              </td>
              <td className="break-all">{reward.ticker}</td>
              <td className="break-all">
                {normalizeAmount(
                  Number(reward.amount),
                  Number(reward.decimals)
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : null;
}
