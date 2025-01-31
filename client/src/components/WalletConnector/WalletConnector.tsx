import React, { CSSProperties } from "react";
import { ConnectWallet } from "@newm.io/cardano-dapp-wallet-connector";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Themes } from "src/entities/common.entities";

const WalletConnector = () => {
  const theme = useSelector((state: RootState) => state.global.theme);

  const mainButtonStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "center",
    color: theme === Themes.dark ? "#fff" : "#333",
    backgroundColor: theme === Themes.dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.3s, box-shadow 0.3s",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return <ConnectWallet mainButtonStyle={mainButtonStyle} />;
};

export default WalletConnector;
