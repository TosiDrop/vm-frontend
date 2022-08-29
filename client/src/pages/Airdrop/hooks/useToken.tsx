import {
  AdaAddress,
  getTokenArrayInWallet,
  Token,
  validateAirdropRequest,
  TokenAddress,
  AirdropRequest,
  AirdropDetail,
  execAirdrop,
  sleep,
  getAirdrop,
} from "../utils";
import { getTxStatus } from "src/services/airdrop.services";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { showModal } from "src/reducers/globalSlice";
import { ModalTypes, InfoModalTypes } from "src/entities/common.entities";

const useToken = () => {
  const [addressList, setAddressList] = useState<TokenAddress[]>([]);
  const [addresses, setAddresses] = useState<AdaAddress[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [validated, setValidated] = useState(false);
  const [airdropDetail, setAirdropDetail] = useState<AirdropDetail>({
    txFee: 0,
    adaToSpend: 0,
    multiTx: false,
  });
  const [totalToken, setTotalToken] = useState(0);
  const [loading, setLoading] = useState(false);
  const [multiTxTransactions, setMultiTxTransactions] = useState<any>([]);

  const api = useSelector((state: RootState) => state.wallet.api);
  const dispatch = useDispatch();

  const handleAddressList = (addressList: TokenAddress[]) => {
    setAddressList(addressList);
    let totalToken = 0;
    addressList.forEach((a) => (totalToken += a.tokenAmount));
    setTotalToken(totalToken);
  };

  useEffect(() => {
    (async () => {
      if (api) {
        const { tokens, adaAddresses } = await getTokenArrayInWallet(api);
        setTokens(tokens);
        setAddresses(adaAddresses);
      }
    })();
  }, [api]);

  const exec = async () => {
    if (validated) {
      /**
       * if the transaction is validated,
       * execute airdrop
       */
      if (!selectedToken || api == null) return;
      setLoading(true);
      try {
        const airdropHash = await execAirdrop(
          api,
          selectedToken,
          addressList,
          addresses
        );

        let firstTxIsDone: boolean = false;
        while (!firstTxIsDone) {
          firstTxIsDone = await getTxStatus(airdropHash);
          await sleep(500);
        }

        /**
         * check if airdrop is single transaction.
         * if single tx, then airdrop is done in 1 tx
         */

        if (airdropDetail.multiTx) {
          const airdropTransactionsToSign = await getAirdrop(airdropHash);
          /**
           * airdrop successful
           */
          dispatch(
            showModal({
              modalType: ModalTypes.info,
              details: {
                text: "Your token UTxO has been prepared for the airdrop! Please sign the transactions to airdrop",
                type: InfoModalTypes.success,
              },
            })
          );
          setMultiTxTransactions(airdropTransactionsToSign.map((tx) => tx));
        } else {
          /**
           * airdrop successful
           */
          dispatch(
            showModal({
              modalType: ModalTypes.info,
              details: {
                text: "Airdrop successful!",
                type: InfoModalTypes.success,
              },
            })
          );
        }
      } catch (e) {
        /**
         * temporary debug
         */
        console.log(e);
        dispatch(
          showModal({
            modalType: ModalTypes.info,
            details: {
              text: "Airdrop failed :(",
              type: InfoModalTypes.failure,
            },
          })
        );
      }
      setLoading(false);
    } else {
      /**
       * if not yet validated,
       * validate airdrop transaction
       */
      // do validation
      if (!selectedToken) return;
      setLoading(true);
      const airdropRequest: AirdropRequest = await validateAirdropRequest(
        selectedToken,
        addressList,
        addresses
      );

      if (!airdropRequest.valid) {
        dispatch(
          showModal({
            modalType: ModalTypes.info,
            details: {
              text: airdropRequest.errorMessage
                ? airdropRequest.errorMessage
                : "Something is wrong :(",
              type: InfoModalTypes.failure,
            },
          })
        );
        setLoading(false);
        return;
      }

      if (airdropRequest.detail == null) return;

      setAirdropDetail(airdropRequest.detail);
      setValidated(true);
      setLoading(false);
      dispatch(
        showModal({
          modalType: ModalTypes.info,
          details: {
            text: "Airdrop transactions has been validated! You can now send your airdrop",
            type: InfoModalTypes.success,
          },
        })
      );
    }
  };

  return {
    selectedToken,
    tokens,
    setSelectedToken,
    validated,
    exec,
    addressList,
    handleAddressList,
    airdropDetail,
    totalToken,
    loading,
    multiTxTransactions,
  };
};

export default useToken;
