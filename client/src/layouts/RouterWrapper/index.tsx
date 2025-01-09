import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageRoute } from "src/entities/common.entities";
import Claim from "src/pages/Cardano/Claim";
import ClaimHistory from "src/pages/Cardano/ClaimHistory";
import DepositInfoPage from "src/pages/Cardano/Deposit";
import ComingSoonPage from "src/pages/ComingSoon";
import { RootState } from "src/store";

export default function RouterWrapper() {
  const ergoEnabled = useSelector(
    (state: RootState) => state.global.ergoEnabled,
  );
  return (
    <Routes>
      <Route path={PageRoute.claimCardano} element={<Claim />} />
      <Route path={PageRoute.historyCardano} element={<ClaimHistory />} />
      <Route path={PageRoute.depositCardano} element={<DepositInfoPage />} />

      {ergoEnabled ? (
        <Route path={PageRoute.claimErgo} element={<ComingSoonPage />} />
      ) : null}

      <Route path="*" element={<Navigate to={PageRoute.claimCardano} />} />
    </Routes>
  );
}
