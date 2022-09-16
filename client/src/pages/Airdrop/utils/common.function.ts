import { TokenAddress } from "./index";
let Buffer = require("buffer").Buffer;

export const lovelaceToAda = (lovelace: number) => {
  const ada = lovelace / Math.pow(10, 6);
  return Number(ada);
};

export const getRealAmount = (amount: number, decimal: number) => {
  return Math.floor(amount / Math.pow(10, decimal));
};

export const shortenAddress = (addr: string) => {
  return `${addr.slice(0, 6)}...${addr.slice(addr.length - 8)}`;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const convertBufferToHex = (inBuffer: Uint8Array): string => {
  const inString = Buffer.from(inBuffer, "utf8").toString("hex");
  return inString;
};

export const csvToArray = (csv: string): string[] => {
  csv = csv.replaceAll("\r", ""); // for windows line ending
  const parsedCsv = csv.split("\n");
  if (parsedCsv[parsedCsv.length - 1] === "") parsedCsv.pop();
  return parsedCsv;
};

export const splitAmountArray = (
  addressAmountParsed: string[]
): TokenAddress[] => {
  const res: TokenAddress[] = [];
  let temp: string[] = [];
  for (let addressAmountInfo of addressAmountParsed) {
    temp = addressAmountInfo.split(",");
    let addr = temp[0];
    let amount = Number(temp[1]);
    if (typeof temp[0] !== "string" || isNaN(amount)) {
      throw new Error("invalid csv");
    }
    res.push({
      address: temp[0],
      tokenAmount: Number(Number(temp[1])),
    });
  }
  return res;
};
