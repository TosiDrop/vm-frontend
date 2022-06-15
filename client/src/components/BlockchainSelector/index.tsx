import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import CardanoLogo from 'src/assets/cardano-logo.png'
import ErgoLogo from 'src/assets/ergo-logo.png'
import useComponentVisible from 'src/hooks/useComponentVisible';
import './index.scss'

const CLASS = 'blockchain-selector'

const BlockchainSelector = () => {
  const { ref, visible, setVisible } = useComponentVisible(false)

  const handleClick = () => {
    setVisible(!visible)
  }

  const switchBlockchain = (blockchain: string) => {

  }

  return (
    <div className={`${CLASS} ${'cardano'}`} onClick={() => handleClick()} ref={ref}>
      <img src={CardanoLogo}></img>
      <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
      <div className={`${CLASS}__select ${visible ? 'visible' : 'hidden'}`}>
        {/* <div className={`${CLASS}__option cardano` onClick={() => switchBlockchain('cardano')}}>
          <img src={CardanoLogo}></img>
        </div> */}
        <div className={`${CLASS}__option ergo`} onClick={() => switchBlockchain('ergo')}>
          <img src={ErgoLogo}></img>
        </div>
      </div>
    </div>
  )
}

export default BlockchainSelector