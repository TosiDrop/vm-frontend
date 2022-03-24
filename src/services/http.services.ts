import { GetRewards } from "../entities/address-info-response.entity";
const axios = require('axios').default;
const serverUrl = 'http://localhost:3001'

export async function getRewards(stakeAddress: string): Promise<GetRewards | undefined> {
    const response = await axios.get(`${serverUrl}/getrewards?staking_address=${stakeAddress}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}