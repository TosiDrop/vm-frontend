import axios from "axios";

async function get(params: string) {
    const g_api_token = '2c261c243e1bdf5946caf902b124de4dabaa6905a367bbef010467a7e64f4689';
    //const response = await axios.post(`https://vmtest.adaseal.eu/api.php?token=${g_api_token}&action=${params}`);
    const response = await fetch(`/api`);
    return response;
}

export async function SanitizeAddr(address: string) {
    return await get(`sanitize_address&address=${address}`);
}

// export function GetRewards($staking_address) {
//     return self:: get("get_rewards&staking_address=${staking_address}");
// }

// export function GetPools() {
//     return self:: get("get_pools");
// }

// export function GetTokens() {
//     return self:: get("get_tokens");
// }
