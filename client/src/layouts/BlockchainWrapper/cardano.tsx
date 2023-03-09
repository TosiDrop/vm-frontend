import { useEffect } from "react";
import { CardanoTypes } from "src/entities/cardano";

import useWallet from "src/hooks/useWallet";

interface Props {
  children: JSX.Element;
}

export default function Cardano({ children }: Props) {
  const { connectWallet } = useWallet();
  /**
   * run on mount, hence disabling eslint
   */
  useEffect(() => {
    const init = async () => {
      const walletKey = localStorage.getItem("wallet-provider");

      if (walletKey) {
        connectWallet(walletKey as CardanoTypes.WalletKeys);
      }
    };
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}
