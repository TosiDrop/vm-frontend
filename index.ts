import express from "express";
import url from 'url';
import axios from 'axios';
import cors from 'cors';
import { AccountInfo, AccountRewards, EpochInfo, PoolInfo } from './src/entities/koios.entities'
import { ClaimableToken, GetRewards, GetTokens, SanitizeAddress } from './src/entities/vm.entities'
import { ExtendedMetadata, Metadata } from './src/entities/common.entities'
import { formatTokens } from './src/services/utils.services'
require('dotenv').config()

const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const PORT = process.env.PORT || 3000;
const VM_API_TOKEN = process.env.VM_API_TOKEN_TESTNET || process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

const app = express();
app.use(cors());
app.use(express.static('build'))

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

app.get("/sanitizeaddr", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.address) {
        const stakingAddressResponse = await getFromVM(`sanitize_address&address=${queryObject.address}`);
        res.send(stakingAddressResponse);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.get("/getrewards", async (req: any, res: any) => {
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
                                    delegated_pool: `[${poolInfo.meta_json.name}] ${poolInfo.meta_json.description}`,
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
                res.send({ error: 'Address not found' });
            }
        }).catch(error => {
            res.send(error);
        });
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

