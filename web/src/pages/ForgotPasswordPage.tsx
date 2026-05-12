import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface FormValues {
  email: string;
}

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await authApi.forgotPassword(data.email);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-600 dark:text-brand-400">TodoSaaS</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Reset your password</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-center text-sm text-gray-700 dark:text-gray-300">
              If that email is registered, a reset code has been sent. Check your inbox.
            </p>
            <Link
              to="/login"
              className="mt-4 block text-center text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
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
            <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
              Send Reset Code
            </Button>
          </form>
        )}

        {!submitted && (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
