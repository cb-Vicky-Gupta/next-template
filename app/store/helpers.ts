import {
  AsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
  Draft,
} from "@reduxjs/toolkit";

type StateWithError = {
  error: string | null;
};

export const handleAsyncReducers = <T, S extends StateWithError>(
  builder: ActionReducerMapBuilder<S>,
  asyncThunk: AsyncThunk<T, any, {}>,
  onFulfilled: (state: Draft<S>, action: PayloadAction<T>) => void
) => {
  builder
    .addCase(asyncThunk.fulfilled, (state, action) => {
      onFulfilled(state, action); // state is Draft<S>
      state.error = null;
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.error =
        (action.payload as string) ||
        action.error?.message ||
        "Something went wrong";
    });
};
