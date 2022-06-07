import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Themes } from "src/entities/common.entities";

interface ModalState {
    theme: Themes;
}

const initialState: ModalState = {
    theme: localStorage.getItem("theme")
        ? (localStorage.getItem("theme") as Themes)
        : Themes.dark,
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
    },
});

export const { toggleTheme, setTheme } = globalSlice.actions;
export default globalSlice.reducer;
