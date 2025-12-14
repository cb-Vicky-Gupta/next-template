export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdDate?: string;
}

export interface Sort {
  attributes: string[];
  sorts: ("asc" | "desc")[];
}

export interface SearchParameter {
  search: string;
  sort: Sort;
}

export interface Pagination {
  itemsPerPage: number;
  pageNo: number;
  totalCount: number;
}

export interface TodoState {
  allTodos: Todo[];
  searchParameter: SearchParameter;
  pagination: Pagination;
  filters: any[];
  loading: boolean;
  error: string | null;
}