import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Themes, Blockchain } from "src/entities/common.entities";

interface ModalState {
    theme: Themes;
    showMenu: boolean;
    blockchain: Blockchain;
    showWalletModal: boolean;
}

const initialState: ModalState = {
    theme: localStorage.getItem("theme")
        ? (localStorage.getItem("theme") as Themes)
        : Themes.dark,
    showMenu: false,
    blockchain: Blockchain.cardano,
    showWalletModal: false,
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
        setShowWalletModal: (state, action: PayloadAction<boolean>) => {
            state.showWalletModal = action.payload
        }
    },
});

export const { toggleTheme, setTheme, toggleMenu, setShowMenu, setBlockchain, setShowWalletModal } =
    globalSlice.actions;
export default globalSlice.reducer;
