import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WalletApi, {
    CIP0030API,
} from "src/services/connectors/wallet.connector";

interface WalletState {
    api: CIP0030API | undefined;
}

const initialState: WalletState = {
    api: undefined,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        connectWallet: (state, action: PayloadAction<WalletApi>) => {
            state.api = action.payload?.wallet?.api;
        },
    },
});

export const { connectWallet } = walletSlice.actions;
export default walletSlice.reducer;
