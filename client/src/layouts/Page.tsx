import React from 'react';
import { Rewards } from '../pages/Rewards';
import { RewardsHistory } from '../pages/RewardsHistory';
import { Dashboard } from '../pages/Dashboard';
import { Feedback } from '../pages/Feedback';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
        