import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface FormValues {
  email: string;
  password: string;
  confirm: string;
}

export function RegisterPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await authApi.register(data.email, data.password);
      setAuth(res.access_token, res.user);
      toast.success("Account created!");
      navigate("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-600 dark:text-brand-400">TodoSaaS</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirm?.message}
            {...register("confirm", {
              required: "Please confirm password",
              validate: (v) => v === watch("password") || "Passwords do not match",
            })}
          />
          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
