import { useState } from 'react';
import ModalComponent, { ModalTypes } from '../components/modal.component';
import { getRewards } from '../services/http.services';
import "../variables.scss";
import './rewards.page.scss';

function Rewards() {
    const [modalVisible, setModalVisible] = useState(false);
    const [hideCheck, setHideCheck] = useState(false);
    const [hideStakingInfo, setHideStakingInfo] = useState(true);
    const [hideSendAdaInfo, setHideSendAdaInfo] = useState(true);
    const [tokensToClaim, setTokensToClaim] = useState<string[]>([]);

    const showModal = () => {
        setModalVisible(true);
    }

    const checkRewards = async () => {
        const rewards = await getRewards('stake1uyv6zrzgemcqxmlx8qkf05aytqlz2qvcz37awdkpc7kqgyq8r4dfl');
        setHideStakingInfo(false);
    }

    const claimRewards = () => {
        setHideCheck(true);
        setHideStakingInfo(true);
        setHideSendAdaInfo(false);
    }

    return (
        <div className='rewards'>
            {<ModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} modalContent='Modal Content' modalType={ModalTypes.info} />}
            <h1>Claim your rewards</h1>

            <div className={'content check' + (hideCheck ? ' hidden' : '')}>
                <p>Enter your wallet/stake address or $handle to view your rewards</p>
                <input type="text"></input>
                <div className='content-button'>
                    <button className='tosi-button is-one-fifth' onClick={checkRewards}>Check my rewards</button>
                    <div className='fill'></div>
                </div>
            </div>

            <div className={'content staked' + (hideStakingInfo ? ' hidden' : '')}>
                <div className="stake-pool-logo">LOGO</div>
                Currently staking 1200 ADA with [NETA2] anetaBTC LISO stake pool
            </div>

            <div className={'claim-list' + (hideStakingInfo ? ' hidden' : '')}>
                {
                    [1, 2].map(val => {
                        return <div className='claim-item'>
                            <div className='selection'>
                                <input type="checkbox"></input>
                                650 available
                            </div>
                            <div className='token-info'>
                                <div>LOGO</div>
                                <div>cNETA ()</div>
                            </div>
                            <div className='claim-token'>
                                <button className='tosi-button' onClick={claimRewards}>Claim my rewards</button>
                            </div>
                        </div>
                    })
                }
            </div>

            <div className={'content claim' + (hideStakingInfo ? ' hidden' : '')}>
                <div className='text'>Selected 1 token</div>
                <button className='tosi-button' onClick={claimRewards}>Claim my rewards</button>
            </div>

            <div className={'content claim-status' + (hideSendAdaInfo ? ' hidden' : '')}>
                Claim status
            </div>

            <div className={'content tx-details' + (hideSendAdaInfo ? ' hidden' : '')}>
                Transaction details
            </div>
        </div>
    );
}

export default Rewards;