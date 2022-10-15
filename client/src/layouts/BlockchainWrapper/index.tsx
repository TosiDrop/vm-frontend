import { useLocation } from "react-router-dom";
import Agnostic from "./agnostic";
import Cardano from "./cardano";
import Ergo from "./ergo";

interface Props {
  children: JSX.Element;
}

export default function BlockchainWrapper({ children }: Props) {
  const location = useLocation().pathname;
  const isOnCardano = location.includes("cardano");
  const isOnErgo = location.includes("ergo");

  if (isOnCardano) {
    return <Cardano>{children}</Cardano>;
  } else if (isOnErgo) {
    return <Ergo>{children}</Ergo>;
  } else {
    return <Agnostic>{children}</Agnostic>;
  }
}
