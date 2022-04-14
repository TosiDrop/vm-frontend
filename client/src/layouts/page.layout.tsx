import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from '../pages/dashboard';
import Rewards from '../pages/rewards.page';
import RewardsHistory from '../pages/rewards-history';
import Feedback from '../pages/feedback';
import AirdropPage from '../pages/AirdropPage';
import WalletApi from '../services/connectors/wallet.connector';

interface Params {
    connectedWallet: WalletApi | undefined;
    showModal: (text: string) => void;
}

function Page({ connectedWallet, showModal }: Params) {
    return <Routes>
        <Route path="/" element={<Rewards connectedWallet={connectedWallet} showModal={showModal} />} />
        <Route path="/history" element={<RewardsHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/airdrop" element={<AirdropPage />} />
    </Routes>
}

export default Page;
