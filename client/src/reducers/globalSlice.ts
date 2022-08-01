import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    Themes,
    Blockchain,
    InfoModalTypes,
    ModalTypes,
} from "src/entities/common.entities";

interface State {
    theme: Themes;
    showMenu: boolean;
    blockchain: Blockchain;
    showModal: ModalTypes | null;
    infoModalDetails: InfoModalDetails;
    walletModalDetails: WalletModalDetails;
}

interface WalletModalDetails {
    content: any;
}

interface InfoModalDetails {
    text: string;
    type: InfoModalTypes;
}

const initialState: State = {
    theme: localStorage.getItem("theme")
        ? (localStorage.getItem("theme") as Themes)
        : Themes.dark,
    showMenu: false,
    blockchain: Blockchain.cardano,
    showModal: ModalTypes.wallet,
    infoModalDetails: {
        text: "",
        type: InfoModalTypes.info,
    },
    walletModalDetails: {
        content: null,
    },
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            const newTheme =
                state.theme === Themes.dark ? Themes.light : Themes.dark;
            state.theme = newTheme;
            localStorage.setItem("theme", newTheme);
        },
        setTheme: (state, action: PayloadAction<Themes>) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },
        toggleMenu: (state) => {
            state.showMenu = !state.showMenu;
        },
        setShowMenu: (state, action: PayloadAction<boolean>) => {
            state.showMenu = action.payload;
        },
        setBlockchain: (state, action: PayloadAction<Blockchain>) => {
            state.blockchain = action.payload;
        },
        showModal: (
            state,
            action: PayloadAction<{
                modalType: ModalTypes;
                details: InfoModalDetails | WalletModalDetails;
            }>
        ) => {
            const { modalType, details } = action.payload;
            switch (modalType) {
                case ModalTypes.wallet:
                    state.walletModalDetails = details as WalletModalDetails;
                    break;
                case ModalTypes.info:
                    state.infoModalDetails = details as InfoModalDetails;
                    break;
                default:
                    state.infoModalDetails = details as InfoModalDetails;
            }
            state.showModal = modalType;
        },
        hideModal: (state) => {
            state.showModal = null;
        },
    },
});

export const {
    toggleTheme,
    setTheme,
    toggleMenu,
    setShowMenu,
    setBlockchain,
    showModal,
    hideModal,
} = globalSlice.actions;
export default globalSlice.reducer;
