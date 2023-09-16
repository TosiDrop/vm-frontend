import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "./store";

function App() {
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const connectedWallet = useSelector(
    (state: RootState) => state.wallet.walletApi,
  );

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

  const OptHeader = useCallback(() => <Header></Header>, [connectedWallet]);

  return (
    <ThemeWrapper>
      <>
        <PopUp></PopUp>
        <Modal />
        <OptHeader></OptHeader>
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
