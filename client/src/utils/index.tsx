export function copyContent(content_txt: string) {
  const selBox = document.createElement("textarea");
  selBox.value = content_txt;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand("copy");
  document.body.removeChild(selBox);
}

export function abbreviateAddress(address: string, start = 7, end = 4): string {
  return (
    address.substring(0, start) +
    "..." +
    address.substring(address.length - end)
  );
}

export const lovelaceToAda = (lovelace: number) => {
  return lovelace / Math.pow(10, 6);
};
