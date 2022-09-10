import useFile from "./hooks/useFile";
import { TokenAddress, shortenAddress } from "./utils";
import useToken from "./hooks/useToken";
import Select from "./components/Select";
import TransactionBar from "./components/TransactionBar";
import { useEffect, useState } from "react";
import axios from "axios";
import ComingSoon from "../ComingSoon";
import Spinner from "../../components/Spinner";
import Breakdown from "./components/Breakdown";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { WalletKeys } from "src/services/connectors/wallet.connector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading";
import Page from "src/layouts/page";

const AirdropPage = () => {
  const {
    tokens,
    selectedToken,
    setSelectedToken,
    validated,
    exec,
    addressList,
    handleAddressList,
    airdropDetail,
    totalToken,
    loading,
    multiTxTransactions,
  } = useToken();

  const { fileRef, parseFile } = useFile({ handleAddressList });
  const walletName = useSelector((state: RootState) => state.wallet.name);
  const [enabled, setEnabled] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    axios.get("/features").then((res) => {
      setEnabled(res.data.airdrop_enabled);
      setInitialLoading(false);
    });
  }, []);

  const getBtnText = () => {
    switch (true) {
      case validated && loading:
        return "Sending Airdrop";
      case validated && !loading:
        return "Send Airdrop";
      case !validated && loading:
        return "Validating Airdrop";
      case !validated && !loading:
      default:
        return "Validate Airdrop";
    }
  };

  return initialLoading ? (
    <Loading></Loading>
  ) : enabled ? (
    <Page>
      <>
        <p className="text-3xl">Airdrop Tokens</p>
        <div className="">
          {walletName.toLowerCase() !== WalletKeys.nami.toLowerCase() ? (
            <div className="">
              <FontAwesomeIcon icon={faWarning} />
              <span>
                This feature is working properly ONLY for Nami wallet. The use
                of other wallets is not recommended.
              </span>
            </div>
          ) : null}
          <div className="">
            <Select
              tokens={tokens}
              setSelectedToken={setSelectedToken}
            ></Select>
            <input
              ref={fileRef}
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={() => parseFile()}
              hidden
            />
            <label className="" htmlFor="file-upload">
              Upload Addresses
            </label>
          </div>
          {addressList.length ? (
            <div className="">
              <div className="">
                <h1>Address List</h1>
                <span>{addressList.length} address added</span>
              </div>
              {addressList.map((addr: TokenAddress, i: number) => {
                return (
                  <div key={i} className="">
                    {shortenAddress(addr.address)}: {addr.tokenAmount}
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="">
            <h1>Airdrop Breakdown</h1>
            <Breakdown
              selectedToken={selectedToken}
              addressList={addressList}
              totalToken={totalToken}
              validated={validated}
              airdropDetail={airdropDetail}
            ></Breakdown>
          </div>
          {multiTxTransactions.length ? (
            <div className="">
              <h1>Airdrop Transactions</h1>
              {multiTxTransactions.map((tx: any, i: number) => {
                return (
                  <TransactionBar
                    key={tx.cborHex}
                    cborHex={tx.cborHex}
                    description={tx.description}
                    i={i}
                  ></TransactionBar>
                );
              })}
            </div>
          ) : null}
          {!multiTxTransactions.length ? (
            <button
              className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center"
              onClick={() => exec()}
              disabled={!Boolean(addressList.length) || selectedToken == null}
            >
              {getBtnText()}
              {loading ? <Spinner></Spinner> : null}
            </button>
          ) : null}
        </div>
      </>
    </Page>
  ) : (
    <ComingSoon />
  );
};

export default AirdropPage;
