import { faXmark, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, KeyboardEvent } from 'react';
import { ClaimableToken, GetRewards } from '../entities/vm.entities';
import { getRewards } from '../services/http.services';
import { copyContent, formatTokens, getNameFromHex, truncAmount } from '../services/utils.services';
import { HashLoader } from 'react-spinners';
import { PaymentStatus } from '../entities/common.entities';
import WalletApi from '../services/connectors/wallet.connector';
import './rewards.page.scss';

interface Params {
    connectedWallet: WalletApi | undefined;
    showModal: (text: string) => void;
}

function Rewards({ connectedWallet, showModal }: Params) {
    const [hideCheck, setHideCheck] = useState(false);
    const [hideStakingInfo, setHideStakingInfo] = useState(true);
    const [hideSendAdaInfo, setHideSendAdaInfo] = useState(true);
    const [rewards, setRewards] = useState<GetRewards>();
    const [searchAddress, setSearchAddress] = useState<string>();
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [checkedState, setCheckedState] = useState(new Array<boolean>());
    const [checkedCount, setCheckedCount] = useState(0);
    const [adaToSend, setAdaToSend] = useState(0);
    const [aproxReturn, setAproxReturn] = useState(0);
    const [paymentStatus] = useState(PaymentStatus.Awaiting);
    const [showTooltip, setShowTooltip] = useState(false);
    const [sendAdaSpinner, setSendAdaSpinner] = useState(false);

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);

        const updatedCheckedCount = updatedCheckedState.filter(check => check).length;
        setCheckedCount(updatedCheckedCount);
    };

    // TEST ADDRESS = stake_test1up7pxv6u7lf67v6kg08qkzdf6xjtazw7qkz9fae9m3vjyec3nk6yc
    const checkRewards = async () => {
        if (searchAddress) {
            setLoadingRewards(true);
            // TODO: Catch errors and show message
            try {
                const rewards = await getRewards(searchAddress);

                if (rewards && Object.keys(rewards.consolidated_promises).length) {
                    setRewards(rewards);
                    setLoadingRewards(false);
                } else {
                    showModal('No rewards found for the account.');
                    setLoadingRewards(false);
                }
            } catch (ex: any) {
                if (ex?.response?.status === 404) {
                    showModal('Account not found.');
                    setLoadingRewards(false);
                }
            }
        }
    }

    const claimRewardsChecked = async () => {
        if (checkedCount > 0) {
            let tokens: ClaimableToken[] = [];
            checkedState.forEach((check, i) => {
                if (check && rewards?.claimable_tokens[i]) {
                    tokens.push(rewards.claimable_tokens[i]);
                }
            });
            claimRewards(tokens);
        }
    }

    const backRewards = async () => {
        setRewards(undefined);
        setSearchAddress('');
    }

    const sendADA = async () => {
        // TODO: Check that searched stake address === connected wallet stake address
        if (rewards) {
            setSendAdaSpinner(true);
            const txHash = await connectedWallet?.transferAda(rewards.vending_address, adaToSend.toString());
            setSendAdaSpinner(false);
            if (txHash) {
                showModal(txHash);
            }
        }
    }

    const claimRewards = (tokens: ClaimableToken[]) => {
        if (rewards) {
            const tokenValue = 300000;
            const updatedAdaToSend = rewards.min_balance + tokenValue + tokens.length * tokenValue;
            const falseArray = new Array(checkedState.length).fill(false);
            const updatedAproxReturn = updatedAdaToSend - 168000 - 200000 * tokens.length;
            tokens.forEach((t: any, i) => falseArray[i] = true);
            setCheckedState(falseArray);
            setCheckedCount(tokens.length);
            setAdaToSend(updatedAdaToSend);
            setAproxReturn(updatedAproxReturn);
            setHideCheck(true);
            setHideStakingInfo(true)
            setHideSendAdaInfo(false);
        }
    }

    const renderStakeInfo = () => {
        if (rewards?.pool_info) {
            return (<>
                {rewards?.pool_info?.delegated_pool_logo ? <img className='pool-logo' src={rewards?.pool_info?.delegated_pool_logo} alt='' /> : ''}
                <div className='pool-info'>
                    <div className='staking-info'>
                        Currently staking&nbsp;<b>{rewards?.pool_info?.total_balance} ADA</b>&nbsp;with&nbsp;
                        <b className='no-break'>
                            [{rewards?.pool_info?.delegated_pool_name}]&nbsp;
                            {rewards?.pool_info?.delegated_pool_description}
                        </b>
                        <b className='no-break-mobile'>
                            [{rewards?.pool_info?.delegated_pool_name}]
                        </b>
                    </div>
                </div>
            </>)
        } else {
            return (<>Unregisted</>);
        }
    }

    const renderPaymentStatus = () => {
        switch (paymentStatus) {
            case PaymentStatus.Awaiting:
                return (<>
                    Awaiting payment
                </>);
            case PaymentStatus.Completed:
                return (<>
                    Withdraw completed
                </>);
        }
    }

    const triggerTooltip = () => {
        setShowTooltip(true);
        setTimeout(() => {
            setShowTooltip(false);
        }, 1000);
    }

    useEffect(() => {
        if (rewards?.claimable_tokens.length) {
            setCheckedState(new Array(rewards.claimable_tokens.length).fill(false));
            setHideStakingInfo(false);
        } else {
            setCheckedState([]);
            setHideStakingInfo(true);
        }
    }, [rewards?.claimable_tokens]);

    useEffect(() => {
        async function init() {
            if (connectedWallet?.wallet?.api) {
                setSearchAddress(await connectedWallet.getAddress());
                setHideStakingInfo(true);
                setHideSendAdaInfo(true);
            }
        }

        init();
    }, [connectedWallet?.wallet?.api, connectedWallet]);

    return (
        <div className='rewards'>
            <h1>Claim your rewards</h1>

            <div className={'content-reward check' + (hideCheck ? ' hidden' : '')}>
                <p>Enter your wallet/stake address or $handle to view your rewards</p>
                <input
                    className='transparent-input'
                    type="text"
                    value={searchAddress}
                    onInput={(e: KeyboardEvent<HTMLInputElement>) => setSearchAddress((e.target as HTMLInputElement).value)}
                    disabled={!hideStakingInfo}
                ></input>
                <div className='content-button'>
                    <button className='tosi-button' disabled={!hideStakingInfo} onClick={checkRewards}>Check my rewards</button>
                    <button className={'tosi-cancel-button' + (hideStakingInfo ? ' hidden' : '')} onClick={backRewards}>
                        <div className='tosi-cancel-icon'><FontAwesomeIcon icon={faXmark} /></div>
                        <div className='tosi-cancel-text'>Cancel</div>
                    </button>
                    <div className={'loading' + (!loadingRewards ? ' hidden' : '')}>
                        <HashLoader color='#73badd' loading={loadingRewards} size={25} />
                    </div>
                </div>
            </div>

            <div className={'staking-info' + (hideStakingInfo ? ' hidden' : '')}>
                <div className={'content-reward staked'}>
                    {renderStakeInfo()}
                </div>

                <div className={'claim-list'}>
                    {
                        rewards?.claimable_tokens?.map((token, index) => {
                            return <div className='claim-item' key={index}>
                                <div className='selection'>
                                    <label className='noselect'>
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${index}`}
                                            name={token.ticker}
                                            value={token.ticker}
                                            checked={checkedState[index]}
                                            onChange={() => handleOnChange(index)}
                                        />
                                        {truncAmount(token.amount, token.decimals)} available
                                    </label>
                                </div>
                                <div className='token-drop'>
                                    <div className='token-info'>
                                        <img alt='' src={token.logo}></img>
                                        <div>{token.assetId.split('.').length > 1 ? getNameFromHex(token.assetId.split('.')[1]) : getNameFromHex(token.assetId.split('.')[0])}</div>
                                    </div>
                                    <button className='tosi-button' onClick={() => { return claimRewards([token]) }}>Claim token</button>
                                </div>
                            </div>
                        })
                    }
                </div>

                <div className={'content-reward claim'}>
                    <div className='text'>Selected {checkedCount} token</div>
                    <button className='tosi-button' disabled={checkedCount === 0} onClick={claimRewardsChecked}>
                        <div className='down-arrow' ></div>
                        Claim my rewards
                    </button>
                </div>
            </div>

            <div className={'status-step' + (hideSendAdaInfo ? ' hidden' : '')}>
                <div className={'content-reward claim-status-head'}>
                    Claim status: <p className='payment-status'>{renderPaymentStatus()}</p>
                </div>
                <div className='content-reward claim-status-body'>
                    <div className="icon-input">
                        <div className={'tooltip-icon' + (showTooltip ? '' : ' hidden')}>Address copied</div>
                        <div className='icon' onClick={() => {
                            copyContent(rewards ? rewards.vending_address : '');
                            triggerTooltip();
                        }}>
                            <FontAwesomeIcon icon={faCopy} />
                        </div>
                        <input className='transparent-input' type="text" disabled={true} value={rewards?.vending_address} />
                    </div>
                    <img className='qr-address' alt='' src={'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + rewards?.vending_address} />
                    <div className='complete-info'>Complete the withdrawal process by sending <b>{formatTokens(adaToSend.toString(), 6, 1)} ADA</b> to the above address</div>
                    <button className='tosi-button' onClick={sendADA}>
                        Send ADA
                        <HashLoader color='#73badd' loading={sendAdaSpinner} size={25} />
                    </button>
                    <div className='complete-send-info'><small>Please only send {formatTokens(adaToSend.toString(), 6, 1)} ADA. Any other amount will be considered an error and refunded in aproximately 72 hours</small></div>
                </div>

                <div className='content-reward tx-details-head'>
                    <div>Transaction Details</div>
                    <div></div>
                </div>
                <div className='content-reward tx-details-body'>
                    <div>Selected {checkedCount} tokens</div>
                    <div>{formatTokens(((checkedCount * 300000)).toString(), 6, 1)} ADA</div>
                </div>
                <div className='content-reward tx-details-body'>
                    <div>Withdraw Fees</div>
                    <div>{formatTokens(rewards?.withdrawal_fee, 6, 1)} ADA</div>
                </div>
                <div className='content-reward tx-details-body'>
                    <div>Base Deposit</div>
                    <div>{formatTokens(((rewards?.min_balance || 0) + 300000).toString(), 6, 1)} ADA</div>
                </div>
                <div className='content-reward tx-details-body small-body'>
                    <div>You Send</div>
                    <div>{formatTokens((adaToSend).toString(), 6, 1)} ADA</div>
                </div>
                <div className='content-reward tx-details-body small-body'>
                    <div>Tx Fees</div>
                    <div>~0.168053 ADA</div>
                </div>
                <div className='content-reward tx-details-body small-body-last'>
                    <div>Total transaction</div>
                    <div>~{formatTokens((adaToSend + 168053).toString(), 6, 3)} ADA</div>
                </div>
                <div className='content-reward tx-details-body'>
                    <div>You'll get back (Aprox)</div>
                    <div>~{formatTokens(aproxReturn.toString(), 6, 3)} ADA</div>
                </div>
                <div className='content-reward tx-details-footer'>
                    <div className="deposit-info">You will pay a deposit, we will discount the withdraw fees and the tx fees (variable depending amount and size of tokens). Usually it'll cost no more than 0.5 ADA</div>
                </div>
            </div>
        </div>
    );
}

export default Rewards;
