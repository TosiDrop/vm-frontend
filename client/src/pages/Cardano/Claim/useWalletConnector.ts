import { useEffect, useState } from "react";
import { useConnectWallet } from "@newm.io/cardano-dapp-wallet-connector";

export function useWalletConnector() {
  const { wallet, getAddress } = useConnectWallet();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (wallet) {
      getAddress((address: string) => {
        setAddress(address);
      });
    } else {
      setAddress(null);
    }
  }, [wallet, getAddress]);

  return { address };
}
