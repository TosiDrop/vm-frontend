export function formatTokens(amount: string | undefined, decimals: number | undefined, decimalsToShow: number | undefined = decimals): string {
    decimals = decimals === null ? 6 : decimals;
    if (amount && decimals && decimalsToShow && decimals > 0) {
        if (amount.length > decimals) {
            const decimalPart = amount.substring(amount.length - decimals);
            return amount.substring(0, amount.length - decimals) + '.' + decimalPart.substring(0, decimalsToShow);
        } else {
            const newAmount = amount.padStart(decimals + 1, '0');
            const decimalPart = newAmount.substring(decimals + 1 - amount.length);
            return newAmount.substring(0, newAmount.length - decimals) + '.' + decimalPart.substring(0, decimalsToShow);
        }
    }
    else {
        return amount || '0';
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

export function copyContent(content_txt: string) {
    const selBox = document.createElement('textarea');
    selBox.value = content_txt;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
}

export function abbreviateAddress(address: string, start = 7, end = 4): string {
    return address.substring(0, start) + '...' + address.substring(address.length - end)
}