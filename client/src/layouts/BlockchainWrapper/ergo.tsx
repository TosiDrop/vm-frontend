import Header from "src/components/Header";
import { WalletConnector } from "src/entities/common.entities";

interface Props {
  children: JSX.Element;
}

export default function Ergo({ children }: Props) {
  return (
    <>
      <Header walletConnector={WalletConnector.ergo}></Header>
      {children}
    </>
  );
}
