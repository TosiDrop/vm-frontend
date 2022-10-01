import { useSelector } from "react-redux";

import { RootState } from "src/store";
import Modal from "src/components/Modal";
import Footer from "src/components/Footer";
import AppPopUp from "src/components/AppPopUp";
import Router from "src/layouts/router";
import "src/styles.scss";

function App() {
  const theme = useSelector((state: RootState) => state.global.theme);

  return (
    <div className={`app ${theme}`}>
      <div className="w-full text flex flex-col items-center">
        <AppPopUp></AppPopUp>
        <Modal />
        <Router />
        <Footer></Footer>
      </div>
    </div>
  );
}

export default App;
