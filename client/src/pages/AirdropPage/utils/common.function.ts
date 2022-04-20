let Buffer = require("buffer").Buffer;

export const lovelaceToAda = (lovelace: number) => {
    const ada = (lovelace / Math.pow(10, 6)).toFixed(2);
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
