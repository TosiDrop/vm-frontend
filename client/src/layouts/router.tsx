import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";

const Airdrop = lazy(() => import("../pages/Airdrop"));
const Claim = lazy(() => import("..//pages/Claim"));
const ClaimHistory = lazy(() => import("../pages/ClaimHistory"));
const DepositInfoPage = lazy(() => import("src/pages/Deposit"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Feedback = lazy(() => import("../pages/Feedback"));

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={PageRoute.claimCardano} element={<Claim />} />
        <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />
        <Route path={PageRoute.historyCardano} element={<ClaimHistory />} />
        <Route path={PageRoute.dashboardCardano} element={<Dashboard />} />
        <Route path={PageRoute.feedbackCardano} element={<Feedback />} />
        <Route path={PageRoute.airdropCardano} element={<Airdrop />} />
        <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
