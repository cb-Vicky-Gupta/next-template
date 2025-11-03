import { apiCall } from "../../axios";
import { todosUrl } from "@/app/services/urls/todos";
export const addTodo = async (data: string): Promise<any> => {
  return apiCall({ url: todosUrl.createTodo, method: "POST", payload: data });
};
export const getTodos = async (data: any): Promise<any> => {
  return apiCall({ url: todosUrl.getTodos, method: "POST", payload: data });
};
export const updateTodo = async (id: string, data: string): Promise<any> => {
  return apiCall({
    url: todosUrl.updateTodo(id),
    method: "POST",
    payload: data,
  });
};
