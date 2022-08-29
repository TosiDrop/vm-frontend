import { AirdropDetail, Token, TokenAddress } from "../../utils";
import "./index.scss";

interface Props {
  selectedToken: Token | null;
  addressList: TokenAddress[];
  totalToken: number;
  validated: boolean;
  airdropDetail: AirdropDetail;
}

const CLASS = "breakdown";

const Breakdown = ({
  selectedToken,
  addressList,
  totalToken,
  validated,
  airdropDetail,
}: Props) => {
  return (
    <>
      <table className={`${CLASS}__table`}>
        <tbody>
          <tr>
            <td>Selected Token</td>
            <td>{selectedToken?.ticker}</td>
          </tr>
          <tr>
            <td>Total Address</td>
            <td>{addressList.length}</td>
          </tr>
          <tr>
            <td>Total token</td>
            <td>
              {totalToken} {selectedToken?.ticker}
            </td>
          </tr>
          {validated ? (
            <>
              <tr>
                <td>Total ADA to spend</td>
                <td>{airdropDetail.adaToSpend} ADA</td>
              </tr>
              <tr>
                <td>Estimated fee</td>
                <td>{airdropDetail.txFee} ADA</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </>
          ) : null}
        </tbody>
      </table>
      {airdropDetail.multiTx ? (
        <div className={`${CLASS}__warning`}>
          IMPORTANT: This airdrop needs multiple transactions. The first
          transaction will modify your UTxO for the airdrop. After the UTxO is
          modified, please sign all the airdrop transactions.
        </div>
      ) : null}
    </>
  );
};

export default Breakdown;
