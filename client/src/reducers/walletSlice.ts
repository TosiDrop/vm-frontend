import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WalletApi from "src/services/connectors/wallet.connector";

interface WalletState {
    connectedWallet: WalletApi | undefined;
}

const initialState: WalletState = {
    connectedWallet: undefined,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        connectWallet: (state, action: PayloadAction<WalletApi>) => {
            console.log(action.payload);
            state.connectedWallet = action.payload;
        },
    },
});

export const { connectWallet } = walletSlice.actions;
export default walletSlice.reducer;
