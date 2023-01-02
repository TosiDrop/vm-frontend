import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NetworkId } from "src/entities/common.entities";
import { ErgoWalletApi } from "src/entities/ergo";
import WalletApi, {
  CIP0030API,
} from "src/services/connectors/wallet.connector";

interface WalletState {
  walletApi: WalletApi | undefined;
  api: CIP0030API | undefined;
  name: string;
  networkId: NetworkId | undefined;
  isWrongNetwork: boolean;
  ergoWalletApi: ErgoWalletApi | null;
}

const initialState: WalletState = {
  walletApi: undefined,
  api: undefined,
  name: "",
  networkId: undefined,
  isWrongNetwork: false,
  ergoWalletApi: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<WalletApi>) => {
      if (!action.payload) return;
      state.walletApi = action.payload;
      if (!action.payload.wallet) return;
      state.name = action.payload.wallet.name;
      state.api = action.payload.wallet.api;
    },
    setNetworkId: (state, action: PayloadAction<NetworkId>) => {
      state.networkId = action.payload;
    },
    setIsWrongNetwork: (state, action: PayloadAction<boolean>) => {
      state.isWrongNetwork = action.payload;
    },
    setErgoWallet: (state, action: PayloadAction<ErgoWalletApi | null>) => {
      state.ergoWalletApi = action.payload;
    },
  },
});

export const { connectWallet, setNetworkId, setIsWrongNetwork, setErgoWallet } =
  walletSlice.actions;
export default walletSlice.reducer;
