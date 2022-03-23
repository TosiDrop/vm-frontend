const express = require("express");
const url = require('url');
const axios = require('axios').default;
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const g_api_token = '2c261c243e1bdf5946caf902b124de4dabaa6905a367bbef010467a7e64f4689';

const app = express();
app.use(cors());

async function get(params: string) {
    return await axios.get(`https://vmtest.adaseal.eu/api.php?token=${g_api_token}&action=${params}`);
}

app.get("/sanitizeaddr", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.address) {
        const stakingAddressResponse = await get(`sanitize_address&address=${queryObject.address}`);
        res.send(stakingAddressResponse.data);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.get("/getrewards", async (req: any, res: any) => {
    const queryObject = url.parse(req.url, true).query;
    const stakeAddress: string = queryObject.staking_address;
    if (stakeAddress && stakeAddress.startsWith('stake1')) {
        const getRewardsResponse = await get(`get_rewards&staking_address=${stakeAddress}`);
        res.send(getRewardsResponse.data);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

// app.get("/getpools", async (req, res) => {
//     res.send(await get(`get_pools`));
// });

// app.get("/gettokens", async (req, res) => {
//     const res2 = await get(`get_tokens`);
//     res.json(res2.data);
// });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});