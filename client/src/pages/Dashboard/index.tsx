import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";

type Countdown = {
  days: number | null;
  hours: number | null;
  minutes: number | null;
};

function Dashboard() {
  const [assetData, setAssetData] = useState(null);
  const [priceData, setPriceData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState<Countdown>({
    days: null,
    hours: null,
    minutes: null,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const today = new Date();

      function getNextFiveDayInterval() {
        const baseDate = new Date(Date.UTC(2024, 1, 14, 21, 45));
        const difference = today.getTime() - baseDate.getTime();
        const intervalsSinceBase = Math.floor(
          difference / (5 * 24 * 60 * 60 * 1000)
        );

        const nextInterval =
          baseDate.getTime() + intervalsSinceBase * (5 * 24 * 60 * 60 * 1000);
        const soonestDate = new Date(nextInterval + 5 * 24 * 60 * 60 * 1000);

        return soonestDate;
      }

      // Get the soonest upcoming date in the 5-day interval based on today's date
      const nextFiveDayInterval = getNextFiveDayInterval();
      const timeDifference = nextFiveDayInterval.getTime() - today.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursDifference = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutesDifference = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );

      setCountdown({
        days: daysDifference,
        hours: hoursDifference,
        minutes: minutesDifference,
      });
    };

    calculateCountdown();

    const interval = setInterval(calculateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          "https://dexhunter.sbase.ch/swap/averagePrice/ADA/a8a1dccea2e378081f2d500d98d022dd3c0bd77afd9dbc7b55a9d21b63544f5349",
          {
            headers: {
              accept: "application/json",
              "X-Partner-Id":
                "tosidrop616464723171396b347435723668783279366577636b65746a6b6167376e736e79643539747278326e72376d7435396c34737138386568717166666e70616c6d74666d736c6d6e707a6764776b643979717132663464653566326371716e733373676d6d74766cda39a3ee5e6b4b0d3255bfef95601890afd80709",
            },
          }
        );
        const jsonData = await response.json();
        setPriceData(jsonData.price_ba * 1000000000);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchPriceData();
        await setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const analyticsFields = [
    {
      header: "cTOSI Holders",
      value: "-",
    },
    {
      header: "Community Revenue",
      value: null,
    },
    {
      header: "Your cTOSI Staked",
      value: null,
    },
    {
      header: "Total Claims",
      value: "-",
    },
    {
      header: "Market Cap",
      value: priceData ? `${Math.round(priceData).toLocaleString()} ADA` : "-",
    },
    {
      header: "Total cTOSI Staked",
      value: null,
    },
  ];

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <p className="text-3xl">Dashboard</p>
      <div className="flex flex-col gap-2">
        {countdown.days != null && (
          <p className="">
            Time to next epoch (360): {countdown.days}d {countdown.hours}h{" "}
            {countdown.minutes}m
          </p>
        )}
        <div className="h-7 overflow-hidden rounded-2xl drop-shadow-xl">
          <progress
            value={70}
            max={100}
            className="w-full h-full progress-color"
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-3xl">Analytics</p>
          <div className="line-gradient bg-white h-1 rounded drop-shadow-xl" />
        </div>
        {priceData && (
          <div className="grid md:grid-cols-3 gap-8">
            {analyticsFields.map((field, index) => (
              <div
                className="rounded-2xl background p-16 items-center flex flex-col lg:gap-6"
                key={index}
              >
                <span className="font-bold text-center text-2xl">
                  {field.header}
                </span>
                {field.value !== null ? (
                  <span className="font-bold text-center text-3xl">
                    {field.value}
                  </span>
                ) : (
                  <span className="font-bold text-center text-xl">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
