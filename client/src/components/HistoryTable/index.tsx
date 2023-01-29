import { ParsedReward } from "src/entities/common.entities";

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
        {claimHistory.map(({ delivered_on, ticker, amount }, i) => {
          const date = new Date(delivered_on + "+0100");
          return (
            <tr key={i}>
              <td>
                <div>
                  {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
                </div>
              </td>
              <td className="break-all">{ticker}</td>
              <td className="break-all">{amount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : null;
}
