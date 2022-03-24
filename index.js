const express = require("express");
const url = require('url');
const axios = require('axios').default;
const cors = require('cors');
require('dotenv').config()

const PORT = process.env.PORT || 3001;
const VM_API_TOKEN = process.env.VM_API_TOKEN;
const VM_URL = process.env.VM_URL;

const app = express();
app.use(cors());

async function get(params) {
    return await axios.get(`${VM_URL}/api.php?token=${VM_API_TOKEN}&action=${params}`);
}

app.get("/sanitizeaddr", async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    if (queryObject.address) {
        const stakingAddressResponse = await get(`sanitize_address&address=${queryObject.address}`);
        res.send(stakingAddressResponse.data);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.get("/getrewards", async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const stakeAddress = queryObject.staking_address;
    if (stakeAddress && stakeAddress.startsWith('stake')) {
        const getRewardsResponse = await get(`get_rewards&staking_address=${stakeAddress}`);
        res.send(getRewardsResponse.data);
    } else {
        res.send({ error: 'Address seems invalid' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});