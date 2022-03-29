export function formatTokens(amount: string, decimals: number | undefined, decimalsToShow: number | undefined = decimals): string {
    decimals = decimals === null ? 6 : decimals;
    if (decimals && decimalsToShow && decimals > 0) {
        return amount.substring(0, amount.length - decimals) + '.' + amount.substring(amount.length - decimalsToShow);
    }
    else {
        return amount;
    }
}

export function truncAmount(amount: number, decimals: number): number {
    return Math.trunc(amount * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function getNameFromHex(str1: string) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
    }
    return str === '' ? 'ADA' : str;
}