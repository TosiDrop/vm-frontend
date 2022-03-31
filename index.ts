import express from "express";
import url from 'url';
import axios from 'axios';
import cors from 'cors';
import { AccountInfo } from './src/entities/koios.entities'
import { ClaimableToken, GetRewards, GetTokens, SanitizeAddress } from './src/entities/vm.entities'
require('dotenv').config()

const PORT = process.env.PORT || 3001;
const VM_API_TOKEN = process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL_TESTNET || process.env.VM_URL;
const VM_KOIOS_URL = process.env.KOIOS_URL_TESTNET || process.env.KOIOS_URL;

const app = express();
app.use(cors());
app.use(express.static('serve'))

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutting down')
    })
})

async function getFromVM<T>(params: any) {
    return axios.get<T>(`${VM_URL}/api.php?token=${VM_API_TOKEN}&action=${params}`);
}

async function getFromKoios<T>(action: string, params: any) {
    return axios.get<T>(`${VM_KOIOS_URL}/${action}?${params}`);
}

async function getAccountInfo(stakeAddress: string) {
    return getFromKoios<AccountInfo[]>('account_info', `_address=${stakeAddress}`)
}

async function getTokens() {
    return getFromVM<GetTokens>('get_tokens');
}

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP"
    })
})

app.get("/sanitizeaddr", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.address) {
        const stakingAddressResponse = await getFromVM(`sanitize_address&address=${queryObject.address}`);
        res.send(stakingAddressResponse.data);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.get("/getrewards", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    const address = queryObject.address;
    if (queryObject.address) {
        getFromVM<SanitizeAddress>(`sanitize_address&address=${address}`).then(async (stakingAddressResponse) => {
            if (stakingAddressResponse.data?.staking_address) {
                const stakeAddress = stakingAddressResponse.data.staking_address;
                const getRewardsResponse = await getRewards(stakeAddress);
                const delegatedPool = await getAccountInfo(stakeAddress);
                if (delegatedPool.data && delegatedPool.data.length) {
                    const delegatedPoolInfo = delegatedPool.data[0];
                    // TODO: Search info from pool
                    getRewardsResponse.data.poolInfo = delegatedPoolInfo;
                }
                res.send(getRewardsResponse.data);
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
    if (getRewardsResponse.data) {
        const tokens = (await getTokens()).data;
        if (tokens) {
            let claimableTokens: ClaimableToken[] = [];
            for (const key of Object.keys(getRewardsResponse.data.consolidated_promises)) {
                const token = tokens[key];
                if (token) {
                    claimableTokens.push({
                        assetId: key,
                        ticker: token.ticker,
                        logo: token.logo,
                        decimals: token.decimals,
                        amount: getRewardsResponse.data.consolidated_promises[key]
                    });
                }
            }
            for (const key of Object.keys(getRewardsResponse.data.consolidated_rewards)) {
                const token = tokens[key];
                if (token) {
                    claimableTokens.push({
                        assetId: key,
                        ticker: token.ticker,
                        logo: token.logo,
                        decimals: token.decimals,
                        amount: getRewardsResponse.data.consolidated_rewards[key]
                    });
                }
            }
            getRewardsResponse.data.claimableTokens = claimableTokens;
        }
    }
    return getRewardsResponse;
}

