import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalTypes } from "src/entities/common.entities";

interface ModalState {
    text: string;
    show: boolean;
    type: ModalTypes;
}

const initialState: ModalState = {
    text: "",
    show: false,
    type: ModalTypes.failure,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal: (
            state,
            action: PayloadAction<{ text: string; type: ModalTypes }>
        ) => {
            state.show = true;
            state.text = action.payload.text;
            state.type = action.payload.type;
        },
        hideModal: (state) => {
            state.show = false;
        },
    },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
