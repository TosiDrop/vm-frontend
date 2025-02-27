import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useConnectWallet, UseConnectWalletResult } from "@newm.io/cardano-dapp-wallet-connector";
import { setWalletDetails } from "src/reducers/walletSlice";

export function useWalletConnector() {
  const { wallet, getAddress }: UseConnectWalletResult = useConnectWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNetworkId = async () => {
      if (wallet) {
        getAddress((address: string) => {
          setAddress(address);
          dispatch(setWalletDetails({ address, networkId, wallet }));
        });

        try {
          const id = await wallet.getNetworkId();
          setNetworkId(id);;
          dispatch(setWalletDetails({ address, networkId: id, wallet }));
        } catch (error) {
          console.log("Failed to retrieve network ID:", error);
        }
      } else {
        setAddress(null);
        setNetworkId(null);
        console.log("Wallet is not connected");
        dispatch(setWalletDetails({ address: null, networkId: null, wallet: null }));
      }
    };

    fetchNetworkId();
  }, [wallet, getAddress, dispatch, address, networkId]);

  return { address, networkId, wallet };
}
