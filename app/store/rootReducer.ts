import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import todosReducer from "./features/todo/todoSlice";
export const rootReducer = combineReducers({
  // Add your reducers here
  auth: authReducer,
  todos: todosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
