import { useState } from "react";
import { clsx } from "clsx";
import { todosApi } from "@/api/todos";
import { useTodoStore } from "@/store/todoStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import type { Todo } from "@/types";
import toast from "react-hot-toast";

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const { updateTodo, removeTodo } = useTodoStore();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [togglingId, setTogglingId] = useState(false);
  const [deletingId, setDeletingId] = useState(false);
  const [savingId, setSavingId] = useState(false);

  const handleToggle = async () => {
    setTogglingId(true);
    try {
      const updated = await todosApi.update(todo.id, { completed: !todo.completed });
      updateTodo(updated);
    } catch {
      toast.error("Failed to update todo");
    } finally {
      setTogglingId(false);
    }
  };

  const handleDelete = async () => {
    setDeletingId(true);
    try {
      await todosApi.delete(todo.id);
      removeTodo(todo.id);
    } catch {
      toast.error("Failed to delete todo");
    } finally {
      setDeletingId(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setSavingId(true);
    try {
      const updated = await todosApi.update(todo.id, { title: editTitle.trim() });
      updateTodo(updated);
      setEditing(false);
    } catch {
      toast.error("Failed to save todo");
    } finally {
      setSavingId(false);
    }
  };

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={handleToggle}
        disabled={togglingId}
        className="mt-0.5 flex-shrink-0"
        aria-label="Toggle complete"
      >
        {togglingId ? (
          <Spinner size="sm" />
        ) : (
          <div
            className={clsx(
              "h-5 w-5 rounded-full border-2 transition-colors",
              todo.completed
                ? "border-green-500 bg-green-500"
                : "border-gray-300 dark:border-gray-600 hover:border-brand-500"
            )}
          >
            {todo.completed && (
              <svg className="h-full w-full p-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setEditing(false);
              }}
              className="flex-1"
              autoFocus
            />
            <Button loading={savingId} onClick={handleSave} className="px-3">
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)} className="px-3">
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <p
              className={clsx(
                "font-medium leading-snug",
                todo.completed && "text-gray-400 line-through dark:text-gray-500"
              )}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{todo.description}</p>
            )}
          </>
        )}
      </div>

      {!editing && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Edit todo"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deletingId}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
            aria-label="Delete todo"
          >
            {deletingId ? (
              <Spinner size="sm" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
