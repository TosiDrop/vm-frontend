import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from '../pages/dashboard';
import Rewards from '../pages/rewards.page';
import RewardsHistory from '../pages/rewards-history';
import Feedback from '../pages/feedback';
import WalletApi from '../services/connectors/wallet.connector';

interface Params {
    connectedWallet: WalletApi | undefined;
}

function Page({ connectedWallet }: Params) {
    return <Routes>
        <Route path="/" element={<Rewards connectedWallet={connectedWallet} />} />
        <Route path="/history" element={<RewardsHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
    </Routes>
}

export default Page;
