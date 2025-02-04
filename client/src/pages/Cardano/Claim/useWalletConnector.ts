import { useEffect, useState } from "react";
import { useConnectWallet, UseConnectWalletResult } from "@newm.io/cardano-dapp-wallet-connector";

export function useWalletConnector() {
  const { wallet, getAddress }: UseConnectWalletResult = useConnectWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);

  useEffect(() => {
    const fetchNetworkId = async () => {
      if (wallet) {
        getAddress((address: string) => {
          setAddress(address);
          console.log("Address retrieved:", address);
        });

        try {
          const id = await wallet.getNetworkId();
          setNetworkId(id);
          console.log("Network ID:", id);
        } catch (error) {
          console.error("Failed to retrieve network ID:", error);
        }
      } else {
        setAddress(null);
        setNetworkId(null);
        console.log("Wallet is not connected");
      }
    };

    fetchNetworkId();
  }, [wallet, getAddress]);

  return { address, networkId, wallet };
}
