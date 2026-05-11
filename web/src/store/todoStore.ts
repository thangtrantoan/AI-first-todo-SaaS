import { create } from "zustand";
import type { Todo } from "@/types";

interface TodoState {
  todos: Todo[];
  loading: boolean;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  removeTodo: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  loading: false,
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((s) => ({ todos: [todo, ...s.todos] })),
  updateTodo: (todo) =>
    set((s) => ({ todos: s.todos.map((t) => (t.id === todo.id ? todo : t)) })),
  removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
  setLoading: (loading) => set({ loading }),
}));
