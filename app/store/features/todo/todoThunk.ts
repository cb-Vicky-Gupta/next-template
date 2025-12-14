import { Todo, TodoState } from "@/app/interfaces/auth";
import { addTodo, getTodos } from "@/app/services/apiCalls/todos";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const onGetTodos = createAsyncThunk(
  "todos/getTodos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { todos: TodoState };
      const payload = {
        search: state.todos.searchParameter.search,
        sort: state.todos.searchParameter.sort,
        filters: state.todos.filters,
        itemsPerPage: state.todos.pagination.itemsPerPage,
        pageNo: state.todos.pagination.pageNo,
      };
      const response = await getTodos(payload);
      if (response.status) return response.data as Todo[];
      return rejectWithValue(response.message);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const onAddTodo = createAsyncThunk(
  "todos/addTodo",
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await addTodo(title);
      if (response.status) return response.data as Todo;
      return rejectWithValue(response.message);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);