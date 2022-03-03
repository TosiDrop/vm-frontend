const express = require("express");
const axios = require('axios').default;

const PORT = process.env.PORT || 3001;
const g_api_token = '2c261c243e1bdf5946caf902b124de4dabaa6905a367bbef010467a7e64f4689';

const app = express();

async function get(params) {
    return await axios.get(`https://vmtest.adaseal.eu/api.php?token=${g_api_token}&action=${params}`);
}

async function getStakeAddress(address) {
    const res2 = await axios.get(`https://cardano-testnet.blockfrost.io/api/v0/addresses/${address}`, {
        headers: {
            'project_id': 'testnetr0AkGxzRj1240kscDx42JI1nzg3Lmq2q'
        }
    });
    return res2;
}

app.get("/sanitizeaddr", async (req, res) => {
    res.send(await get(`sanitize_address&address=${address}`));
});

app.get("/getrewards", async (req, res) => {
    const staking_address = 'stake_test1ur2r3dxdlq04g4s7tmmpnehdrdpermkdufygxp3ftqml9qgyk0226';
    const res2 = await get(`get_rewards&staking_address=${staking_address}`);
    res.send(res2.data);
});

app.get("/getpools", async (req, res) => {
    res.send(await get(`get_pools`));
});

app.get("/gettokens", async (req, res) => {
    const res2 = await get(`get_tokens`);
    res.json(res2.data);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// export function GetPools() {
//     return self:: get("get_pools");
// }

// export function GetTokens() {
//     return self:: get("get_tokens");
// }