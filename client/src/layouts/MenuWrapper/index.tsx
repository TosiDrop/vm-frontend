import { useLocation } from "react-router-dom";
import MenuAgnostic from "src/components/Menu/agnostic";
import MenuCardano from "src/components/Menu/cardano";
import MenuErgo from "src/components/Menu/ergo";
import MobileMenuAgnostic from "src/components/MobileMenu/agnostic";
import MobileMenuCardano from "src/components/MobileMenu/cardano";
import MobileMenuErgo from "src/components/MobileMenu/ergo";

interface Props {
  children: JSX.Element;
}

export default function MenuWrapper({ children }: Props) {
  const location = useLocation().pathname;
  const isOnCardano = location.includes("cardano");
  const isOnErgo = location.includes("ergo");

  const Menu = () => {
    if (isOnCardano) {
      return (
        <>
          <MenuCardano></MenuCardano>
          <MobileMenuCardano></MobileMenuCardano>
        </>
      );
    } else if (isOnErgo) {
      return (
        <>
          <MenuErgo></MenuErgo>
          <MobileMenuErgo></MobileMenuErgo>
        </>
      );
    } else {
      return (
        <>
          <MenuAgnostic></MenuAgnostic>
          <MobileMenuAgnostic></MobileMenuAgnostic>
        </>
      );
    }
  };

  return (
    <div className="w-full max-w-8xl p-5 pt-14 flex flex-row gap-8">
      <Menu></Menu>
      <div className="w-full flex flex-col gap-8">{children}</div>
    </div>
  );
}
