import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";
import Claim from "src/pages/Cardano/Claim";
import ClaimHistory from "src/pages/Cardano/ClaimHistory";
import DepositInfoPage from "src/pages/Cardano/Deposit";
import Pools from "src/pages/Cardano/Pools";
import Projects from "src/pages/Cardano/Projects";
import ComingSoonPage from "src/pages/ComingSoon";
import Feedback from "src/pages/Feedback";
import { RootState } from "src/store";

export default function RouterWrapper() {
  const ergoEnabled = useSelector(
    (state: RootState) => state.global.ergoEnabled
  );
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Claim />} />
      <Route path={PageRoute.historyCardano} element={<ClaimHistory />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />
      <Route path={PageRoute.projectsCardano} element={<Projects />} />
      <Route path={PageRoute.poolsCardano} element={<Pools />} />
      <Route path={PageRoute.feedback} element={<Feedback />} />

      {ergoEnabled ? (
        <Route path={PageRoute.claimErgo} element={<ComingSoonPage />} />
      ) : null}

      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
}
