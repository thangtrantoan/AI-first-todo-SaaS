import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { todosApi } from "@/api/todos";
import { useTodoStore } from "@/store/todoStore";
import toast from "react-hot-toast";

interface FormValues {
  title: string;
  description: string;
}

export function TodoForm() {
  const { addTodo } = useTodoStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const todo = await todosApi.create({
        title: data.title,
        description: data.description || undefined,
      });
      addTodo(todo);
      reset();
    } catch {
      toast.error("Failed to create todo");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="font-semibold">New Todo</h2>
      <Input
        label="Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />
      <Input
        label="Description"
        placeholder="Optional details..."
        {...register("description")}
      />
      <Button type="submit" loading={isSubmitting} className="self-end">
        Add Todo
      </Button>
    </form>
  );
}
