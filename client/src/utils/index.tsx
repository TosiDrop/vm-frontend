import { EpochData } from "src/entities/common.entities";

export const abbreviateAddress = (
  address: string,
  start = 7,
  end = 4
): string => {
  return (
    address.substring(0, start) +
    "..." +
    address.substring(address.length - end)
  );
};

export const lovelaceToAda = (lovelace: number) => {
  return lovelace / Math.pow(10, 6);
};

export const isTxHash = (txHash: string) => {
  return txHash.length === 64 && txHash.indexOf(" ") === -1;
};

const firstEpochSeconds = 1506203091;
const epochDurationSeconds = 432000;

export const calcEpoch = (): EpochData => {
  let currentTimeUTCInSeconds = new Date().getTime() / 1000;
  let secondsInTotalEpochs = currentTimeUTCInSeconds - firstEpochSeconds;
  let secondsInCurrentEpoch = secondsInTotalEpochs % epochDurationSeconds;
  let currentEpoch = secondsInTotalEpochs / epochDurationSeconds;
  let percentDone = currentEpoch % 1;
  currentEpoch = Math.floor(currentEpoch);
  let secondsEpochEnds =
    currentTimeUTCInSeconds - secondsInCurrentEpoch + epochDurationSeconds;
  let endDateCountDownSeconds = secondsEpochEnds - currentTimeUTCInSeconds;

  return {
    currentEpoch: currentEpoch,
    percentDone: percentDone,
    endDate: new Date(secondsEpochEnds * 1000),
    countdownDays: Math.floor(endDateCountDownSeconds / (60 * 60 * 24)),
    countdownHours: Math.floor((endDateCountDownSeconds / (60 * 60)) % 24),
    countdownMinutes: Math.floor((endDateCountDownSeconds / 60) % 60),
    countdownSeconds: Math.floor(endDateCountDownSeconds % 60),
  };
};
