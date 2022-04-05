import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from '../pages/dashboard';
import Rewards from '../pages/rewards.page';
import RewardsHistory from '../pages/rewards-history';
import Feedback from '../pages/feedback';

function Page() {
    return <Routes>
        <Route path="/" element={<Rewards />} />
        <Route path="/history" element={<RewardsHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
    </Routes>
}

export default Page;
