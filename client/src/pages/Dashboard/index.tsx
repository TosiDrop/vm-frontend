import { DashboardData } from "src/entities/vm.entities";
import { getDashboardData } from "src/services/common";
import { useEffect, useState } from "react";
import useErrorHandler from "src/hooks/useErrorHandler";
import { calcEpoch } from "src/utils";
import { EpochData, DashboardItemData } from "src/entities/common.entities";
import ProgressBar from "src/components/ProgressBar";
import DashboardItem from "src/components/DashboardItem";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [epochData, setEpochData] = useState<EpochData>(calcEpoch());
  const { handleError } = useErrorHandler();

  const getDataFromAPI = async () => {
    try {
      const dashboardData = await getDashboardData();
      setDashboardData(dashboardData);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getDataFromAPI();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpochData(calcEpoch());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className="text-3xl">Dashboard</p>
      <div className="py-5 my-5">
        <div>
          Time to epoch {epochData.currentEpoch + 1}: {epochData.countdownDays}d{" "}
          {epochData.countdownHours}h {epochData.countdownMinutes}m{" "}
          {epochData.countdownSeconds}s
        </div>
        <ProgressBar percentage={epochData.percentDone}></ProgressBar>
      </div>

      <p className="text-3xl py-2.5">Analytics</p>
      <div className="w-full rounded-full h-1.5 bg-gradient-to-r from-blue-600 "></div>
      <div className="py-5 my-5 grid grid-cols-3 gap-8">
        <DashboardItem
          title="cTOSI Holders"
          content={dashboardData?.cTOSIHolders}
        ></DashboardItem>
        <DashboardItem
          title="eTOSI Holders"
          content={dashboardData?.eTOSIHolders}
        ></DashboardItem>
        <DashboardItem
          title="Revenue Earned"
          content={dashboardData?.totalRevenue}
          contentSuffix="ADA"
        ></DashboardItem>
        <DashboardItem
          title="Total Claims"
          content={dashboardData?.totalClaims}
        ></DashboardItem>
        <DashboardItem
          title="Market Cap"
          content={dashboardData?.marketCap}
          contentSuffix="ADA"
        ></DashboardItem>
        <DashboardItem
          title="Trading Volume"
          content={dashboardData?.tradingVolume}
        ></DashboardItem>
      </div>
    </div>
  );
}

export default Dashboard;
