import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from '../pages/dashboard';
import Rewards from '../pages/rewards.page';
import RewardsHistory from '../pages/rewards-history';
import Feedback from '../pages/feedback';

export class Page extends React.Component {
    render() {
        return <Router>
        <Routes>
          <Route path="/" element={<Rewards />} />
          <Route path="/history" element={<RewardsHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>;
    }
}
        