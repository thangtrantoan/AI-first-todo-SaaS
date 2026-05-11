import { useTodoStore } from "@/store/todoStore";
import { TodoItem } from "./TodoItem";
import { Spinner } from "@/components/ui/Spinner";

export function TodoList() {
  const { todos, loading } = useTodoStore();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-gray-400 dark:text-gray-600">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm font-medium">No todos yet. Create one above!</p>
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pending ({pending.length})
          </h3>
          <div className="flex flex-col gap-2">
            {pending.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Completed ({completed.length})
          </h3>
          <div className="flex flex-col gap-2">
            {completed.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
