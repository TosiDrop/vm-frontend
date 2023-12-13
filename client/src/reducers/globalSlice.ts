import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Blockchain,
  InfoModalTypes,
  ModalTypes,
  Themes,
} from "src/entities/common.entities";

interface State {
  theme: Themes;
  showMenu: boolean;
  showModal: ModalTypes | null;
  infoModalDetails: InfoModalDetails;
  chain: Blockchain;
  ergoEnabled: boolean;
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
  showModal: null,
  infoModalDetails: {
    text: "",
    type: InfoModalTypes.info,
  },
  chain: Blockchain.cardano,
  ergoEnabled: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === Themes.dark ? Themes.light : Themes.dark;
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
    showModal: (
      state,
      action: PayloadAction<{
        modalType: ModalTypes;
        details?: InfoModalDetails;
      }>,
    ) => {
      const { modalType, details } = action.payload;
      switch (modalType) {
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
    setChain: (state, action: PayloadAction<Blockchain>) => {
      state.chain = action.payload;
    },
    setErgoEnabled: (state, action: PayloadAction<boolean>) => {
      state.ergoEnabled = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMenu,
  setShowMenu,
  showModal,
  hideModal,
  setChain,
  setErgoEnabled,
} = globalSlice.actions;
export default globalSlice.reducer;
