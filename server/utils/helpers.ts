import axios from "axios";
import { CardanoNetwork } from ".";

let Buffer = require("buffer").Buffer;

export const translateAdaHandle = async (
  handle: string,
  network: any,
  koiosUrl: string
) => {
  let urlPrefix, policyId;

  switch (network) {
    case CardanoNetwork.mainnet:
      urlPrefix = "api";
      policyId = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
      break;
    case CardanoNetwork.testnet:
    default:
      urlPrefix = "testnet";
      policyId = "8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3";
  }

  handle = handle.slice(1); // remove $
  if (!handle.length) return null; // check if handle is $
  const handleInHex = Buffer.from(handle).toString("hex");
  const url = `${koiosUrl}/asset_address_list?_asset_policy=${policyId}&_asset_name=${handleInHex}`;
  const data = (await axios.get(url)).data;
  if (!data.length) return null;
  const address = data[0].payment_address;
  return address;
};
