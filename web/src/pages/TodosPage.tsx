import { useEffect } from "react";
import { todosApi } from "@/api/todos";
import { useTodoStore } from "@/store/todoStore";
import { TodoForm } from "@/components/todos/TodoForm";
import { TodoList } from "@/components/todos/TodoList";
import toast from "react-hot-toast";

export function TodosPage() {
  const { setTodos, setLoading } = useTodoStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const todos = await todosApi.list();
        setTodos(todos);
      } catch {
        toast.error("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setTodos, setLoading]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <TodoForm />
        <TodoList />
      </div>
    </main>
  );
}
