import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "src/reducers/walletSlice";
import modalReducer from "src/reducers/modalSlice";
import globalReducer from "src/reducers/globalSlice";

const store = configureStore({
    reducer: {
        wallet: walletReducer,
        modal: modalReducer,
        global: globalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
