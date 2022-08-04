import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Rewards from "../pages/Rewards";
import RewardsHistory from "../pages/RewardsHistory";
import Feedback from "../pages/Feedback";
import Airdrop from "../pages/Airdrop";
import DepositInfoPage from "src/pages/Rewards/DepositInfoPage";

function Page() {
    return (
        <Routes>
            <Route path="/" element={<Rewards />} />
            <Route path="/claim" element={<DepositInfoPage />} />
            <Route path="/history" element={<RewardsHistory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default Page;
