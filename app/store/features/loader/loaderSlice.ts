import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: "",
    message: "",
    loading: false,
    loadingTop: false,
    loadingMessage: "",
};

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        apiLoading: (state, action) => {
            state.loading = true;
            state.loadingMessage = action.payload?.loadingMessage || "";
            state.message = "";
            state.error = "";
        },
        apiLoadingEnd: (state) => {
            state.loading = false;
            state.loadingMessage = "";
            state.message = "";
            state.error = "";
        },
        apiLoadingTop: (state) => {
            state.loadingTop = true;
            state.message = "";
            state.error = "";
            state.loadingMessage = "";
        },
        apiLoadingTopEnd: (state) => {
            state.loadingTop = false;
            state.message = "";
            state.error = "";
            state.loadingMessage = "";
        },
        apiMessage: (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.error = "";
            state.loadingMessage = "";
        },
        apiErrorMessage: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = "";
            state.loadingMessage = "";
        },
    }
});

export const {
    apiLoading,
    apiLoadingEnd,
    apiLoadingTop,
    apiLoadingTopEnd,
    apiMessage,
    apiErrorMessage
} = statusSlice.actions;

export default statusSlice.reducer;