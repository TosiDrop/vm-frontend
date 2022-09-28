import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Rewards from "../pages/Rewards";
import RewardsHistory from "../pages/RewardsHistory";
import Feedback from "../pages/Feedback";
import Airdrop from "../pages/Airdrop";
import DepositInfoPage from "src/pages/Rewards/DepositInfoPage";
import { PageRoute } from "src/entities/common.entities";

const Router = () => {
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Rewards />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />
      <Route path={PageRoute.historyCardano} element={<RewardsHistory />} />
      <Route path={PageRoute.dashboardCardano} element={<Dashboard />} />
      <Route path={PageRoute.feedbackCardano} element={<Feedback />} />
      <Route path={PageRoute.airdropCardano} element={<Airdrop />} />
      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
};

export default Router;
