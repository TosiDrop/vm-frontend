import NautilusUrl from "src/assets/nautilus.svg";

export enum ErgoWalletName {
  nautilus = "nautilus",
}

export interface ErgoWalletMetadata {
  name: string;
  displayName: string;
  iconUrl: string;
}

export interface ErgoWalletApi {
  auth: Function;
  constructor: Function;
  get_balance: Function;
  get_change_address: Function;
  get_unused_addresses: Function;
  get_used_addresses: Function;
  get_utxos: Function;
  sign_data: Function;
  sign_tx: Function;
  sign_tx_input: Function;
  submit_tx: Function;
}

export const ERGO_WALLET_INFO: Record<ErgoWalletName, ErgoWalletMetadata> = {
  [ErgoWalletName.nautilus]: {
    iconUrl: NautilusUrl,
    name: "nautilus",
    displayName: "Nautilus",
  },
};

export type NautilusErgoWalletApi = ErgoWalletApi;
