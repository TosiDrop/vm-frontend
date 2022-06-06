import { NetworkId } from "src/entities/common.entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WalletApi, {
    CIP0030API,
} from "src/services/connectors/wallet.connector";

interface WalletState {
    walletApi: WalletApi | undefined;
    api: CIP0030API | undefined;
    name: string;
    networkId: NetworkId | undefined;
}

const initialState: WalletState = {
    walletApi: undefined,
    api: undefined,
    name: "",
    networkId: undefined,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        connectWallet: (state, action: PayloadAction<WalletApi>) => {
            if (!action.payload) return;
            if (!action.payload.wallet) return;
            state.walletApi = action.payload;
            state.name = action.payload.wallet.name;
            state.api = action.payload.wallet.api;
        },
        setNetworkId: (state, action: PayloadAction<NetworkId>) => {
            state.networkId = action.payload;
        },
    },
});

export const { connectWallet, setNetworkId } = walletSlice.actions;
export default walletSlice.reducer;
