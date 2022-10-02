import { Routes, Route, Navigate } from "react-router-dom";
import Projects from "../pages/Projects";
import Dashboard from "../pages/Dashboard";
import Claim from "../pages/Claim";
import ClaimHistory from "../pages/ClaimHistory";
import Feedback from "../pages/Feedback";
import Airdrop from "../pages/Airdrop";
import DepositInfoPage from "src/pages/Deposit";
import { PageRoute } from "src/entities/common.entities";

const Router = () => {
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Claim />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />
      <Route path={PageRoute.historyCardano} element={<ClaimHistory />} />
      <Route path={PageRoute.projectsCardano} element={<Projects />} />    
      <Route path={PageRoute.dashboardCardano} element={<Dashboard />} />
      <Route path={PageRoute.feedbackCardano} element={<Feedback />} />
      <Route path={PageRoute.airdropCardano} element={<Airdrop />} />
      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
};

export default Router;
