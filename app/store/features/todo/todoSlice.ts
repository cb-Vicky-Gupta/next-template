
import { createSlice} from "@reduxjs/toolkit";
import { handleAsyncReducers } from "../../helpers";
import { onGetTodos } from "./todoThunk";
import { TodoState } from "@/app/interfaces/auth";



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
