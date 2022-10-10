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
