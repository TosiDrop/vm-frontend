import { GetRewards } from "../entities/vm.entities";
const axios = require('axios').default;
const serverUrl = 'http://localhost:3001'

export async function getRewards(address: string): Promise<GetRewards | undefined> {
    const response = await axios.get(`${serverUrl}/getrewards?address=${address}`);
    if (response && response.data) {
        return response.data;
    }
    return undefined;
}