import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useConnectWallet,
  UseConnectWalletResult,
} from "@newm.io/cardano-dapp-wallet-connector";
import { setWalletDetails } from "src/reducers/walletSlice";

export function useWalletConnector() {
  const { wallet, getAddress }: UseConnectWalletResult = useConnectWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDetails = async () => {
      if (wallet) {
        try {
          const [fetchedAddress, fetchedNetworkId] = await Promise.all([
            new Promise<string>((resolve) => getAddress(resolve)),
            wallet.getNetworkId(),
          ]);

          setAddress(fetchedAddress);
          setNetworkId(fetchedNetworkId);
          dispatch(
            setWalletDetails({
              address: fetchedAddress,
              networkId: fetchedNetworkId,
            }),
          );
        } catch (error) {
          console.error("Failed to retrieve wallet details:", error);

          dispatch(setWalletDetails({ address: null, networkId: null }));
        }
      } else {
        setAddress(null);
        setNetworkId(null);
        dispatch(setWalletDetails({ address: null, networkId: null }));
      }
    };

    fetchDetails();
  }, [wallet, getAddress, dispatch]);

  return { address, networkId, wallet };
}
