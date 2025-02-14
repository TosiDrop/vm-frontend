import { useCallback } from "react";
import Footer from "src/components/Footer";
import PopUp from "src/components/PopUp";
import RouterWrapper from "src/layouts/RouterWrapper";
import "src/styles.scss";
import Header from "./components/Header";
import BlockchainWrapper from "./layouts/BlockchainWrapper";
import MenuWrapper from "./layouts/MenuWrapper";
import ThemeWrapper from "./layouts/ThemeWrapper";

function App() {
  const OptHeader = useCallback(() => <Header></Header>, []);

  return (
    <ThemeWrapper>
      <>
        <PopUp></PopUp>
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
