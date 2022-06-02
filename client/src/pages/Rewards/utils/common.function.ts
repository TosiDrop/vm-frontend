export const isTxHash = (txHash: string) => {
    return txHash.length === 64 && txHash.indexOf(" ") === -1;
};
