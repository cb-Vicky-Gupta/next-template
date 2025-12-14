import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import todosReducer from "./features/todo/todoSlice";
import loaderReducer from "./features/loader/loaderSlice";

export const rootReducer = combineReducers({
  // Add your reducers here
  auth: authReducer,
  todos: todosReducer,
  loader : loaderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
