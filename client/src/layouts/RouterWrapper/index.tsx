import { Navigate, Route, Routes } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";
import Airdrop from "src/pages/Cardano/Airdrop";
import Claim from "src/pages/Cardano/Claim";
import DepositInfoPage from "src/pages/Cardano/Deposit";
import Pools from "src/pages/Cardano/Pools";
import Projects from "src/pages/Cardano/Projects";
import Feedback from "src/pages/Feedback";

export default function RouterWrapper() {
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Claim />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />
      <Route path={PageRoute.projectsCardano} element={<Projects />} />
      <Route path={PageRoute.airdropCardano} element={<Airdrop />} />
      <Route path={PageRoute.poolsCardano} element={<Pools />} />
      <Route path={PageRoute.feedback} element={<Feedback />} />
      {/* <Route path={PageRoute.claimErgo} element={<ComingSoonPage />} /> */}
      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
}
