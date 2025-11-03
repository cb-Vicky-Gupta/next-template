import { addTodo, getTodos } from "@/app/services/apiCalls/todos";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleAsyncReducers } from "../../helpers";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdDate?: string;
}

interface Sort {
  attributes: string[];
  sorts: ("asc" | "desc")[];
}

interface SearchParameter {
  search: string;
  sort: Sort;
}

interface Pagination {
  itemsPerPage: number;
  pageNo: number;
  totalCount: number;
}

interface TodoState {
  allTodos: Todo[];
  searchParameter: SearchParameter;
  pagination: Pagination;
  filters: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  allTodos: [],
  searchParameter: {
    search: "",
    sort: { attributes: ["createdDate"], sorts: ["desc"] },
  },
  pagination: { itemsPerPage: 10, pageNo: 1, totalCount: 0 },
  filters: [],
  loading: false,
  error: null,
};

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
// Slice
export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncReducers(builder, onGetTodos, (state, action) => {
      state.allTodos = action.payload;
    });
  },
});

export default todoSlice.reducer;
