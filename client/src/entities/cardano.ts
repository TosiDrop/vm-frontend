export namespace CardanoTypes {
  export type Address = string;

  export enum WalletKeys {
    anetawallet = "anetawallet",
    begin = "begin",
    cardwallet = "cardwallet",
    eternl = "eternl",
    flint = "flint",
    gerowallet = "gerowallet",
    nami = "nami",
    nufi = "nufi",
    typhoncip30 = "typhoncip30",
    yoroi = "yoroi",
    LodeWallet = "LodeWallet",
  }

  export enum WalletState {
    notConnected,
    connecting,
    connected,
    wrongNetwork,
  }

  export enum NetworkId {
    preview,
    mainnet,
    undefined,
  }
}
