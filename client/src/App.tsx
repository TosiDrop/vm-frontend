import { useSelector } from "react-redux";
import AppPopUp from "src/components/AppPopUp";
import Footer from "src/components/Footer";
import Modal from "src/components/Modal";
import RouterWrapper from "src/layouts/RouterWrapper";
import { RootState } from "src/store";
import "src/styles.scss";
import BlockchainWrapper from "./layouts/BlockchainWrapper";
import MenuWrapper from "./layouts/MenuWrapper";
import ThemeWrapper from "./layouts/ThemeWrapper";

function App() {
  const theme = useSelector((state: RootState) => state.global.theme);

  return (
    <ThemeWrapper>
      <>
        <AppPopUp></AppPopUp>
        <Modal />
        <BlockchainWrapper>
          <MenuWrapper>
            <RouterWrapper />
          </MenuWrapper>
        </BlockchainWrapper>
        <Footer></Footer>
      </>
    </ThemeWrapper>
  );
}

export default App;
