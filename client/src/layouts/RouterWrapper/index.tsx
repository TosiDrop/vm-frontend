import { Navigate, Route, Routes } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";
import Claim from "src/pages/Cardano/Claim";
import ClaimHistory from "src/pages/Cardano/ClaimHistory";
import DepositInfoPage from "src/pages/Cardano/Deposit";

export default function RouterWrapper() {
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Claim />} />
      <Route path={PageRoute.historyCardano} element={<ClaimHistory />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />

      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
}
