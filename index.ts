import express from "express";
import url from 'url';
import axios from 'axios';
import cors from 'cors';
import { createClient } from '@node-redis/client';
import { AccountInfo, PoolInfo } from './client/src/entities/koios.entities'
import { ClaimableToken, GetRewards, GetTokens, SanitizeAddress } from './client/src/entities/vm.entities'
import { ExtendedMetadata, Metadata } from './client/src/entities/common.entities'
import { formatTokens } from './client/src/services/utils.services'
require('dotenv').config()

const CLOUDFLARE_PSK = process.env.CLOUDFLARE_PSK;
const PORT = process.env.PORT || 3000;
const VM_API_TOKEN = process.env.VM_API_TOKEN_TESTNET || process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisUrl = 'redis://' + REDIS_HOST + ':' + REDIS_PORT;
export const redisClient = createClient({
    url:  redisUrl
});
export type RedisClientType = typeof redisClient;
redisClient.on('error', (err) => console.error('ERROR: Unable to connect to Redis - ', err));
redisClient.on('ready', () => console.log('Connected to Redis: ' + REDIS_HOST + ':' + REDIS_PORT));

const app = express();
app.use(cors());
app.use(express.static('client/build'))

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server shutting down')
    })
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutting down')
    })
});

async function getFromVM<T>(params: any, cacheKey?: any, timeout?: any) {
    if (cacheKey) {
        await redisClient.connect();
        console.log("DEBUG: cacheKey = " + cacheKey);
        let cachedResult = await redisClient.get('vm:' + cacheKey)
        if (cachedResult) {
	    console.log("DEBUG: cachedResult = " + cachedResult);
	    // return JSON.parse(cachedResult);
	};
        // Cache miss, hit the API
	//console.log("DEBUG: cache miss for cacheKey=" + cacheKey);

        console.log("DEBUG: hitting VM API");
        let data = await axios.get<T>(`${VM_URL}/api.php?token=${VM_API_TOKEN}&action=${params}`);
        console.log("DEBUG: VM result = " + JSON.stringify(data.data));

        console.log("DEBUG: comparing VM to cache");
        if (cachedResult && JSON.parse(cachedResult) == data.data) {
            console.log("DEBUG: VM data and cache data match");
        } else {
            console.log("DEBUG: RAW VM data and JSON.parse'd cache data do NOT match");
        };
        let cacheTimeout = 60;
        if (timeout) {
            cacheTimeout = timeout;
            console.log("DEBUG: timeout = " + cacheTimeout);
        }
        // Cache result
        console.log("DEBUG: adding data to cache for cacheKey=" + cacheKey);
        await redisClient.set('vm:' + cacheKey, JSON.stringify(data.data));
        await redisClient.expire('vm:' + cacheKey, cacheTimeout);
        await redisClient.disconnect();
        return data.data
    }
    console.log("DEBUG: hitting VM API");
    let data = await axios.get<T>(`${VM_URL}/api.php?token=${VM_API_TOKEN}&action=${params}`);
    console.log("DEBUG: VM result = " + JSON.stringify(data.data));
    return data.data;
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
    return getFromVM<GetTokens>('get_tokens', 'tokens', 600);
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

