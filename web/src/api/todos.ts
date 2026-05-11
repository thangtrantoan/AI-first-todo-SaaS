import client from "./client";
import type { Todo } from "@/types";

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const todosApi = {
  list: () => client.get<Todo[]>("/todos/").then((r) => r.data),

  create: (data: TodoCreate) =>
    client.post<Todo>("/todos/", data).then((r) => r.data),

  update: (id: number, data: TodoUpdate) =>
    client.patch<Todo>(`/todos/${id}`, data).then((r) => r.data),

  delete: (id: number) => client.delete(`/todos/${id}`),
};
