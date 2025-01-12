import { useLocation } from "react-router-dom";
import Agnostic from "./agnostic";
import Cardano from "./cardano";

interface Props {
  children: JSX.Element;
}

export default function BlockchainWrapper({ children }: Props) {
  const location = useLocation().pathname;
  const isOnCardano = location.includes("cardano");

  if (isOnCardano) {
    return <Cardano>{children}</Cardano>;
  } else {
    return <Agnostic>{children}</Agnostic>;
  }
}
