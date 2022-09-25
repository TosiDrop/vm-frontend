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
      <Route path={PageRoute.home} element={<Rewards />} />
      <Route path={PageRoute.claim} element={<DepositInfoPage />} />
      <Route path={PageRoute.history} element={<RewardsHistory />} />
      <Route path={PageRoute.dashboard} element={<Dashboard />} />
      <Route path={PageRoute.feedback} element={<Feedback />} />
      <Route path={PageRoute.airdrop} element={<Airdrop />} />
      <Route path="*" element={<Navigate to={PageRoute.home} />} />
    </Routes>
  );
};

export default Router;
