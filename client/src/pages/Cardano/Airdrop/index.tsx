import useFile from "src/components/Airdrop/hooks/useFile";
import { TokenAddress, shortenAddress } from "src/components/Airdrop/utils";
import useToken from "src/components/Airdrop/hooks/useToken";
import Select from "src/components/Airdrop/components/Select";
import TransactionBar from "src/components/Airdrop/components/TransactionBar";
import { useEffect, useState } from "react";
import ComingSoon from "src/pages/ComingSoon";
import Spinner from "src/components/Spinner";
import Breakdown from "src/components/Airdrop/components/Breakdown";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { WalletKeys } from "src/services/connectors/wallet.connector";
import Loading from "src/pages/Loading";
import Page from "src/layouts/page";
import WarningBanner from "src/components/Airdrop/components/WarningBanner";
import { getFeatures } from "src/services/common";
import Header from "src/components/Header";
import Cardano from "src/layouts/cardano";

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

  const init = async () => {
    const features = await getFeatures();
    setEnabled(features.airdrop_enabled ?? false);
    setInitialLoading(false);
  };

  useEffect(() => {
    init();
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
    <Cardano>
      <Page>
        <>
          <p className="text-3xl">Airdrop Tokens</p>
          <div className="flex flex-col gap-4">
            <WarningBanner
              isShown={
                walletName.toLowerCase() !== WalletKeys.nami.toLowerCase()
              }
            />
            <div className="background rounded-2xl p-5 flex flex-row items-center gap-2">
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
              <label
                className="tosi-button py-2.5 px-5 rounded-lg flex flex-row items-center w-full justify-center"
                htmlFor="file-upload"
              >
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
            <div className="background p-5 rounded-2xl gap-2">
              <div>Airdrop Breakdown</div>
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
    </Cardano>
  ) : (
    <ComingSoon />
  );
};

export default AirdropPage;
