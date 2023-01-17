import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Footer from "src/components/Footer";
import Modal from "src/components/Modal";
import PopUp from "src/components/PopUp";
import RouterWrapper from "src/layouts/RouterWrapper";
import "src/styles.scss";
import Header from "./components/Header";
import { Blockchain } from "./entities/common.entities";
import BlockchainWrapper from "./layouts/BlockchainWrapper";
import MenuWrapper from "./layouts/MenuWrapper";
import ThemeWrapper from "./layouts/ThemeWrapper";
import { setChain, setErgoEnabled } from "./reducers/globalSlice";
import { getFeatures } from "./services/common";

function App() {
  const location = useLocation().pathname;
  const dispatch = useDispatch();

  const init = async () => {
    const features = await getFeatures();
    dispatch(setErgoEnabled(features.ergo_enabled));
  };

  const initLocation = () => {
    const isOnCardano = location.includes("cardano");
    const isOnErgo = location.includes("ergo");
    if (isOnCardano) {
      dispatch(setChain(Blockchain.cardano));
    } else if (isOnErgo) {
      dispatch(setChain(Blockchain.ergo));
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    initLocation();
  }, [location]);

  return (
    <ThemeWrapper>
      <>
        <PopUp></PopUp>
        <Modal />
        <Header></Header>
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
