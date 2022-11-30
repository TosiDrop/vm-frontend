import { useSelector } from "react-redux";
import MenuCardano from "src/components/Menu/cardano";
import MenuErgo from "src/components/Menu/ergo";
import MobileMenuCardano from "src/components/MobileMenu/cardano";
import MobileMenuErgo from "src/components/MobileMenu/ergo";
import { Blockchain } from "src/entities/common.entities";
import { RootState } from "src/store";

export default function Menu() {
  const chain = useSelector((state: RootState) => state.global.chain);

  switch (chain) {
    case Blockchain.cardano:
      return (
        <>
          <MenuCardano></MenuCardano>
          <MobileMenuCardano></MobileMenuCardano>
        </>
      );
    case Blockchain.ergo:
      return (
        <>
          <MenuErgo></MenuErgo>
          <MobileMenuErgo></MobileMenuErgo>
        </>
      );
  }
}
