import { Routes, Route } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import Rewards from '../pages/Rewards';
import RewardsHistory from '../pages/RewardsHistory';
import Feedback from '../pages/Feedback';
import Airdrop from '../pages/Airdrop';
import WalletApi from '../services/connectors/wallet.connector';

interface Params {
    connectedWallet: WalletApi | undefined;
    showModal: (text: string) => void;
    wrongNetwork: boolean | undefined;
}

function Page({ connectedWallet, showModal, wrongNetwork }: Params) {
    return <Routes>
        <Route path="/" element={<Rewards connectedWallet={connectedWallet} showModal={showModal} wrongNetwork={wrongNetwork} />} />
        <Route path="/history" element={<RewardsHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/airdrop" element={<Airdrop />} />
    </Routes>
}

export default Page;
