import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Blockchain } from "src/entities/common.entities";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { setBlockchain } from "src/reducers/globalSlice";
import CardanoLogo from "src/assets/cardano-logo.png";
import ErgoLogo from "src/assets/ergo-logo.png";
import useComponentVisible from "src/hooks/useComponentVisible";

const CLASS = "blockchain-selector";

const BlockchainSelector = () => {
  const { ref, visible, setVisible } = useComponentVisible(false);
  const dispatch = useDispatch();

  const blockchain = useSelector((state: RootState) => state.global.blockchain);

  const CurrentBlockchain = () => {
    switch (blockchain) {
      case Blockchain.ergo:
        return (
          <>
            <img src={ErgoLogo} alt="ergo logo"></img>
            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
          </>
        );
      case Blockchain.cardano:
      default:
        return (
          <>
            <img src={CardanoLogo} alt="cardano logo"></img>
            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
          </>
        );
    }
  };

  const BlockchainSwitch = () => {
    switch (blockchain) {
      case Blockchain.ergo:
        return (
          <div className={`${CLASS}__select ${visible ? "visible" : "hidden"}`}>
            <div
              className={`${CLASS}__option cardano`}
              onClick={() => dispatch(setBlockchain(Blockchain.cardano))}
            >
              <img src={CardanoLogo} alt="cardano logo"></img>
            </div>
          </div>
        );
      case Blockchain.cardano:
      default:
        return (
          <div className={`${CLASS}__select ${visible ? "visible" : "hidden"}`}>
            <div
              className={`${CLASS}__option ergo disabled`}
              // onClick={() => dispatch(setBlockchain(Blockchain.ergo))}
              onClick={() => {}}
            >
              <img src={ErgoLogo} alt="ergo logo"></img>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`${CLASS} ${blockchain}`}
      onClick={() => setVisible(!visible)}
      ref={ref}
    >
      <CurrentBlockchain></CurrentBlockchain>
      <BlockchainSwitch></BlockchainSwitch>
    </div>
  );
};

export default BlockchainSelector;
