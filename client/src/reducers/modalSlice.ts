import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalTypes } from "src/entities/common.entities";

interface ModalState {
    text: string;
    show: boolean;
    type: ModalTypes.info;
}

const initialState: ModalState = {
    text: "",
    show: false,
    type: ModalTypes.info,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<string>) => {
            state.show = true;
            state.text = action.payload;
        },
        hideModal: (state) => {
            state.show = false;
        },
    },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
