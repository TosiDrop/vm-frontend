import Header from "src/components/Header";
import { WalletConnector } from "src/entities/common.entities";

interface Props {
  children: JSX.Element;
}

export default function Agnostic({ children }: Props) {
  return (
    <>
      <Header walletConnector={WalletConnector.none}></Header>
      {children}
    </>
  );
}
