import { Cip30Wallet, WalletApi } from "@cardano-sdk/cip30";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardanoTypes } from "src/entities/cardano";
import { NetworkId } from "src/entities/common.entities";

interface WalletState {
  wallet: Cip30Wallet | undefined;
  walletApi: WalletApi | undefined;
  walletAddress: string;
  walletState: CardanoTypes.WalletState;
  name: string;
  networkId: NetworkId | undefined;
  isWrongNetwork: boolean;
}

const initialState: WalletState = {
  wallet: undefined,
  walletApi: undefined,
  walletAddress: "",
  walletState: CardanoTypes.WalletState.notConnected,
  name: "",
  networkId: undefined,
  isWrongNetwork: false,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (
      state,
      action: PayloadAction<
        | {
            wallet: Cip30Wallet;
            walletApi: WalletApi;
            walletAddress: string;
          }
        | undefined
      >,
    ) => {
      state.wallet = action.payload?.wallet;
      state.walletApi = action.payload?.walletApi;
      state.walletAddress = action.payload?.walletAddress ?? "";
    },
    setWalletState: (
      state,
      action: PayloadAction<CardanoTypes.WalletState>,
    ) => {
      state.walletState = action.payload;
    },
    setNetworkId: (state, action: PayloadAction<NetworkId>) => {
      state.networkId = action.payload;
    },
    setIsWrongNetwork: (state, action: PayloadAction<boolean>) => {
      state.isWrongNetwork = action.payload;
    },
  },
});

export const {
  connectWallet,
  setNetworkId,
  setIsWrongNetwork,
  setWalletState,
} = walletSlice.actions;
export default walletSlice.reducer;
