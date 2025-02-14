import { createSlice } from "@reduxjs/toolkit";
import { EnabledWallet } from "@newm.io/cardano-dapp-wallet-connector";
interface WalletState {
  address: string | null;
  networkId: number | null;
  wallet: EnabledWallet | null;
  status: "idle" | "loading" | "failed";
}

const initialState: WalletState = {
  address: null,
  networkId: null,
  wallet: null,
  status: "idle",
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setWalletDetails: (state, action) => {
      state.address = action.payload.address;
      state.networkId = action.payload.networkId;
      state.wallet = action.payload.wallet;
    },
    setFailed: (state) => {
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {},
});

export const { setLoading, setWalletDetails, setFailed } = walletSlice.actions;

export default walletSlice.reducer;
