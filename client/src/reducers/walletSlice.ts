import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WalletApi, {
    CIP0030API,
} from "src/services/connectors/wallet.connector";

interface WalletState {
    api: CIP0030API | undefined;
    name: string;
}

const initialState: WalletState = {
    api: undefined,
    name: '',
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        connectWallet: (state, action: PayloadAction<WalletApi>) => {
            if (!action.payload) return;
            if (!action.payload.wallet) return;
            state.name = action.payload.wallet.name;
            state.api = action.payload.wallet.api;
        },
    },
});

export const { connectWallet } = walletSlice.actions;
export default walletSlice.reducer;
