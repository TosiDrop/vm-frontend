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


export interface EpochData {
  currentEpoch: number,
  percentDone: number,
  endDate: Date,
  countdownDays: number,
  countdownHours: number,
  countdownMinutes: number,
  countdownSeconds: number,
}

const firstEpochSeconds = 1506203091;
const epochDurationSeconds = 432000;

export const calcEpoch = (): EpochData => {
  var currentTimeUTCInSeconds = new Date().getTime() / 1000;
  var secondsInTotalEpochs = currentTimeUTCInSeconds - firstEpochSeconds;
  var secondsInCurrentEpoch = secondsInTotalEpochs % epochDurationSeconds;
  var currentEpoch = secondsInTotalEpochs / epochDurationSeconds;
  var percentDone = currentEpoch % 1;
  currentEpoch = Math.floor(currentEpoch);
  var secondsEpochEnds = currentTimeUTCInSeconds - secondsInCurrentEpoch + epochDurationSeconds;
  var endDateCountDownSeconds = (secondsEpochEnds - currentTimeUTCInSeconds);

  return {
    currentEpoch: currentEpoch,
    percentDone: percentDone,
    endDate: new Date(secondsEpochEnds * 1000),
    countdownDays: Math.floor(endDateCountDownSeconds / (60 * 60 * 24)),
    countdownHours: Math.floor((endDateCountDownSeconds / (60 * 60)) % 24),
    countdownMinutes: Math.floor((endDateCountDownSeconds / 60) % 60),
    countdownSeconds: Math.floor((endDateCountDownSeconds % 60)),
  };
}