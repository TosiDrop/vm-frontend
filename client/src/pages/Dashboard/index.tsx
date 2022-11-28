import Page from "src/layouts/MenuWrapper";
import { DashboardData } from "src/entities/vm.entities";
import { getDashboardData } from "src/services/common";
import { useEffect, useState } from "react";
import useErrorHandler from "src/hooks/useErrorHandler";
import { title } from "process";
import { EpochData, calcEpoch } from "src/utils";

function Dashboard() {
  /*const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );*/

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

  const barStyleWidth = () => {
    // Minimum 2% so it doesn't look weird when at < 2%
    return { width: Math.max(2, epochData.percentDone * 100) + "%" };
  }

  const renderButton = (
    title: string,
    content?: number,
    contentSuffix?: string
  ) => {
    let suffix = contentSuffix ? " " + contentSuffix : "";
    let parsedContent = "?";
    if (content) {
      parsedContent = content.toLocaleString() + suffix;
    }

    return (
      <div className="h-48 rounded-2xl background px-5 py-5 flex flex-col gap-2 items-center">
        <div className="text-xl ">{title}</div>
        <div className="text-4xl ">{parsedContent}</div>
      </div>
    );
  };

  return (
    <div>
      <p className="text-3xl">Dashboard</p>
      <div className="py-5 my-5">
        <div>Time to epoch {epochData.currentEpoch + 1}: {epochData.countdownDays}d {epochData.countdownHours}h {epochData.countdownMinutes}m {epochData.countdownSeconds}s</div>
        <div className="w-full bg-gray-700 rounded-full h-5">
          <div className="bg-green-500 h-5 rounded-full w-4" style={barStyleWidth()}></div>
        </div>
      </div>

      <p className="text-3xl py-2.5">Analytics</p>
      <div className="w-full rounded-full h-1.5 bg-gradient-to-r from-blue-600 "></div>
      <div className="py-5 my-5 grid grid-cols-3 gap-8">
        {renderButton("cTOSI Holders", dashboardData?.cTOSIHolders)}
        {renderButton("eTOSI Holders", dashboardData?.eTOSIHolders)}
        {renderButton("Revenue Earned", dashboardData?.totalRevenue, "ADA")}
        {renderButton("Total Claims", dashboardData?.totalClaims)}
        {renderButton("Market Cap", dashboardData?.marketCap, "ADA")}
        {renderButton("Trading Volume", dashboardData?.tradingVolume)}
      </div>
    </div>
  );
}

export default Dashboard;
