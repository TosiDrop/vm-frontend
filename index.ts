import express from "express";
import url from 'url';
import axios from 'axios';
import cors from 'cors';
import { AccountAddress, AccountInfo, AddressTransactions, PoolInfo, Tip, TransactionInfo, TransactionStatus } from './client/src/entities/koios.entities'
import { ClaimableToken, GetRewards, GetTokens, SanitizeAddress } from './client/src/entities/vm.entities'
import { ExtendedMetadata, Metadata, PaymentTransactionHashRequest, TokenTransactionHashRequest } from './client/src/entities/common.entities'
import { formatTokens } from './client/src/services/utils.services'
require('dotenv').config()

const AIRDROP_ENABLED = process.env.AIRDROP_ENABLED || false;
const CARDANO_NETWORK = process.env.CARDANO_NETWORK || 'testnet';
const CLAIM_ENABLED = process.env.CLAIM_ENABLED || true;
const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const VM_API_TOKEN = process.env.VM_API_TOKEN_TESTNET || process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

const app = express();
app.use(cors());
app.use(express.static('client/build'));
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutting down')
    })
});

async function getFromVM<T>(params: any) {
    return (await axios.get<T>(`${VM_URL}/api.php?token=${VM_API_TOKEN}&action=${params}`)).data;
}

async function getExtendedMetadata(metadataUrl: string): Promise<ExtendedMetadata | undefined> {
    const metadata = (await axios.get<Metadata>(metadataUrl)).data;
    if (metadata?.extended) {
        const extendedMetadata = (await axios.get<ExtendedMetadata>(metadata.extended)).data;
        return extendedMetadata
    }
    return undefined;
}

async function getFromKoios<T>(action: string, params?: any) {
    if (params) {
        return (await axios.get<T>(`${VM_KOIOS_URL}/${action}?${params}`)).data;
    } else {
        return (await axios.get<T>(`${VM_KOIOS_URL}/${action}`)).data;
    }
}

async function postFromKoios<T>(action: string, params?: any) {
    if (params) {
        return (await axios.post<T>(`${VM_KOIOS_URL}/${action}`, params)).data;
    } else {
        return (await axios.post<T>(`${VM_KOIOS_URL}/${action}`)).data;
    }
}

async function getAccountsInfo(stakeAddress: string) {
    return getFromKoios<AccountInfo[]>('account_info', `_address=${stakeAddress}`);
}

async function getAccountsAddresses(stakeAddress: string) {
    return getFromKoios<AccountAddress[]>('account_addresses', `_address=${stakeAddress}`);
}

async function postPoolInfo(pools: string[]) {
    return postFromKoios<PoolInfo[]>('pool_info', { _pool_bech32_ids: pools });
}

async function getTokens() {
    return getFromVM<GetTokens>('get_tokens');
}

app.get("/health", (req: any, res: any) => {
    res.status(200).json({
        status: "UP"
    })
});

app.get("/healthz", async (req: any, res: any) => {
    if (CLOUDFLARE_PSK) {
        if (req.headers['x-cloudflare-psk']) {
            const myPsk = req.headers['x-cloudflare-psk'];
            if (myPsk == CLOUDFLARE_PSK) {
                const authResponse = await getFromVM('is_authenticated');
                res.send(authResponse);
            } else {
                res.send({ error: 'PSK invalid' });
            }
        } else {
            res.send({ error: 'PSK missing' });
        }
    } else {
        res.status(200).json({
            status: "UP"
        })
    }
});

app.get("/features", (req: any, res: any) => {
    res.status(200).json({
        airdrop_enabled: AIRDROP_ENABLED,
        claim_enabled: CLAIM_ENABLED,
        network: CARDANO_NETWORK
    })
});

app.get("/network", (req: any, res: any) => {
    res.status(200).json({
        network: CARDANO_NETWORK === 'testnet' ? 0 : 1
    })
});

app.get("/sanitizeaddr", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.address) {
        const stakingAddressResponse = await getFromVM<SanitizeAddress>(`sanitize_address&address=${queryObject.address}`);
        res.send(stakingAddressResponse);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.get("/getrewards", async (req: any, res: any) => {
    try {
        const queryObject = url.parse(req.url, true).query;
        const address = queryObject.address;
        if (queryObject.address) {
            getFromVM<SanitizeAddress>(`sanitize_address&address=${address}`).then(async (stakingAddressResponse) => {
                if (stakingAddressResponse?.staking_address) {
                    const stakeAddress = stakingAddressResponse.staking_address;
                    const getRewardsResponse = await getRewards(stakeAddress);
                    const accountsInfo = await getAccountsInfo(stakeAddress);
                    if (accountsInfo && accountsInfo.length) {
                        const accountInfo = accountsInfo[0];
                        if (accountInfo.status === 'registered') {
                            const poolsInfo = await postPoolInfo([accountInfo.delegated_pool]);
                            if (poolsInfo && poolsInfo.length) {
                                const poolInfo = poolsInfo[0];
                                if (poolInfo.meta_json) {
                                    let logo = '';
                                    if (poolInfo.meta_url) {
                                        const extendedMetadata = await getExtendedMetadata(poolInfo.meta_url);
                                        if (extendedMetadata) {
                                            logo = extendedMetadata.info.url_png_icon_64x64;
                                        }
                                    }
                                    getRewardsResponse.pool_info = {
                                        delegated_pool_name: poolInfo.meta_json.name,
                                        delegated_pool_description: poolInfo.meta_json.description,
                                        total_balance: formatTokens(accountInfo.total_balance, 6, 2),
                                        delegated_pool_logo: logo,
                                        delegated_pool_ticker: poolInfo.meta_json.ticker
                                    }
                                } else {
                                    // TODO: Pool has no metadata
                                }
                            }
                        }
                    }
                    res.send(getRewardsResponse);
                } else {
                    res.sendStatus(404);
                }
            }).catch(error => {
                res.send({ error: 'An error occurred.' });
            });
        }
    } catch (error: any) {
        res.send({ error: 'An error occurred.' });
    }
});

app.get("/gettransactionstatus", async (req: any, res: any) => {
    try {
        const queryObject = url.parse(req.url, true).query;
        if (queryObject.txHash) {
            const getTransactionStatusResponse = await postFromKoios<TransactionStatus[]>(`tx_status`, { _tx_hashes: [queryObject.txHash] });
            res.send(getTransactionStatusResponse);
        } else {
            res.send({ error: 'Tx hash seems invalid' });
        }
    } catch (error: any) {
        res.send({ error: 'An error occurred.' });
    }
});

app.get("/getblock", async (req: any, res: any) => {
    try {
        const getTipResponse = await getFromKoios<Tip[]>(`tip`);
        res.send({ block_no: (getTipResponse && getTipResponse.length) ? getTipResponse[0].block_no : 0 });
    } catch (error: any) {
        res.send({ error: 'An error occurred.' });
    }
});

app.post("/getpaymenttransactionhash", async (req: any, res: any) => {
    try {
        const requestBody = req.body as PaymentTransactionHashRequest;
        if (requestBody && requestBody.address && requestBody.address.length) {
            const bodyStakingAddressResponse = await getFromVM<SanitizeAddress>(`sanitize_address&address=${requestBody.address}`);
            if (bodyStakingAddressResponse && bodyStakingAddressResponse.staking_address) {
                const accountAddresses = await getAccountsAddresses(bodyStakingAddressResponse.staking_address)
                const getTokenTxHashResponse = await postFromKoios<AddressTransactions[]>(`address_txs`, {
                    _addresses: accountAddresses.map(accountAddress => accountAddress.address),
                    _after_block_height: requestBody.afterBlock || 0
                });
                if (getTokenTxHashResponse && getTokenTxHashResponse.length) {
                    const addressHashes = getTokenTxHashResponse.map(addressTx => addressTx.tx_hash);
                    const getTransactionsInfo = await postFromKoios<TransactionInfo[]>(`tx_info`, { _tx_hashes: addressHashes });
                    const fromStakingAddressResponse = await getFromVM<SanitizeAddress>(`sanitize_address&address=${requestBody.address}`);
                    const toStakingAddressResponse = await getFromVM<SanitizeAddress>(`sanitize_address&address=${requestBody.toAddress}`);
                    if (getTransactionsInfo && getTransactionsInfo.length) {
                        const filteredTxs = getTransactionsInfo.filter(txInfo => {
                            const inputCorrect = txInfo.inputs.some(input => {
                                const stakingAddressCorrect = input.stake_addr === fromStakingAddressResponse.staking_address;
                                return stakingAddressCorrect;
                            });

                            const outputCorrect = txInfo.outputs.some(output => {
                                const stakingAddressCorrect = output.stake_addr === toStakingAddressResponse.staking_address;
                                const amountCorrect = output.value === requestBody.adaToSend.toString();
                                return amountCorrect && stakingAddressCorrect;
                            });

                            return inputCorrect && outputCorrect;
                        });
                        if (filteredTxs && filteredTxs.length) {
                            res.send({ txHash: filteredTxs[0].tx_hash });
                        } else {
                            res.send({ txHash: undefined });
                        }
                    }
                } else {
                    res.send({ txHash: undefined });
                }
            }
        } else {
            res.send({ error: 'Address seems invalid' });
        }
    } catch (error: any) {
        res.send({ error: 'An error occurred.' });
    }
});

app.post("/gettokentransactionhash", async (req: any, res: any) => {
    try {
        const requestBody = req.body as TokenTransactionHashRequest;
        if (requestBody && requestBody.address) {
            const getTokenTxHashResponse = await postFromKoios<AddressTransactions[]>(`address_txs`, {
                _addresses: [requestBody.address],
                _after_block_height: requestBody.afterBlock || 0
            });
            if (getTokenTxHashResponse && getTokenTxHashResponse.length) {
                const addressHashes = getTokenTxHashResponse.map(addressTx => addressTx.tx_hash);
                const getTransactionsInfo = await postFromKoios<TransactionInfo[]>(`tx_info`, { _tx_hashes: addressHashes });
                const stakingAddressResponse = await getFromVM<SanitizeAddress>(`sanitize_address&address=${requestBody.address}`);
                if (getTransactionsInfo && getTransactionsInfo.length) {
                    const filteredTxs = getTransactionsInfo.filter(txInfo => {
                        return txInfo.outputs.some(output => {
                            const stakingAddressCorrect = output.stake_addr === stakingAddressResponse.staking_address;
                            let hasTokensCorrect: any[] = [];
                            output.asset_list.forEach(asset => {
                                const token = requestBody.tokens.find(token => token.policyId === asset.policy_id && token.quantity === asset.quantity);
                                if (token) {
                                    hasTokensCorrect.push(token);
                                }
                            });
                            return hasTokensCorrect.length && hasTokensCorrect.length === output.asset_list.length && stakingAddressCorrect;
                        });
                    });
                    if (filteredTxs && filteredTxs.length) {
                        res.send({ txHash: filteredTxs[0].tx_hash });
                    } else {
                        res.send({ txHash: undefined });
                    }
                }
            } else {
                res.send({ txHash: undefined });
            }
        } else {
            res.send({ error: 'Address seems invalid' });
        }
    } catch (error: any) {
        res.send({ error: 'An error occurred.' });
    }
});

async function getRewards(stakeAddress: string) {
    const getRewardsResponse = await getFromVM<GetRewards>(`get_rewards&staking_address=${stakeAddress}`);
    if (getRewardsResponse) {
        const tokens = await getTokens();
        if (tokens) {
            let claimableTokens: ClaimableToken[] = [];
            for (const key of Object.keys(getRewardsResponse.consolidated_promises)) {
                const token = tokens[key];
                if (token) {
                    claimableTokens.push({
                        assetId: key,
                        ticker: token.ticker,
                        logo: token.logo,
                        decimals: token.decimals,
                        amount: getRewardsResponse.consolidated_promises[key]
                    });
                }
            }
            for (const key of Object.keys(getRewardsResponse.consolidated_rewards)) {
                const token = tokens[key];
                if (token) {
                    claimableTokens.push({
                        assetId: key,
                        ticker: token.ticker,
                        logo: token.logo,
                        decimals: token.decimals,
                        amount: getRewardsResponse.consolidated_rewards[key]
                    });
                }
            }
            getRewardsResponse.claimable_tokens = claimableTokens;
        }
    }
    return getRewardsResponse;
}
