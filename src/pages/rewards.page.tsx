import { useEffect, useState, KeyboardEvent } from 'react';
import ModalComponent, { ModalTypes } from '../components/modal.component';
import { ClaimableToken } from '../entities/vm.entities';
import { getRewards } from '../services/http.services';
import { getNameFromHex, truncAmount } from '../services/utils.services';
import "../variables.scss";
import './rewards.page.scss';

declare global {
    interface Window {
        cardano: any;
    }
}
function Rewards() {
    const [modalVisible, setModalVisible] = useState(false);
    const [hideCheck, setHideCheck] = useState(false);
    const [hideStakingInfo, setHideStakingInfo] = useState(true);
    const [hideSendAdaInfo, setHideSendAdaInfo] = useState(true);
    const [tokensToClaim, setTokensToClaim] = useState<ClaimableToken[]>([]);
    const [searchAddress, setSearchAddress] = useState<string>('');
    const [modalText, setModalText] = useState<string>('');

    const checkRewards = async () => {
        if (searchAddress) {
            const rewards = await getRewards(searchAddress);

            if (rewards && rewards.consolidated_promises) {
                setTokensToClaim(rewards.claimableTokens);
            } else {
                setModalText('Error');
                setModalVisible(true);
            }
        }
    }

    const claimRewards = () => {
        setHideCheck(true);
        setHideStakingInfo(true);
        setHideSendAdaInfo(false);
    }

    useEffect(() => {
        if (tokensToClaim.length) {
            setHideStakingInfo(false);
        }
    }, [tokensToClaim]);

    return (
        <div className='rewards'>
            {<ModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} modalText={modalText} modalType={ModalTypes.info} />}
            <h1>Claim your rewards</h1>

            <div className={'content check' + (hideCheck ? ' hidden' : '')}>
                <p>Enter your wallet/stake address or $handle to view your rewards</p>
                <input type="text" value={searchAddress} onInput={(e: KeyboardEvent<HTMLInputElement>) => setSearchAddress((e.target as HTMLInputElement).value)}></input>
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
                    tokensToClaim.map(token => {
                        return <div className='claim-item'>
                            <div className='selection'>
                                <input type="checkbox"></input>
                                {truncAmount(token.amount, token.decimals)} available
                            </div>
                            <div className='token-info'>
                                <img alt='' src={token.logo}></img>
                                <div>{token.assetId.split('.').length > 1 ? getNameFromHex(token.assetId.split('.')[1]) : getNameFromHex(token.assetId.split('.')[0])}</div>
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