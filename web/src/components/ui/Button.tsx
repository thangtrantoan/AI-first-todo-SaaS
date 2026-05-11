import { clsx } from "clsx";
import { Spinner } from "./Spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost" | "danger";
}

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 focus:ring-brand-500",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 focus:ring-red-500",
};

export function Button({ loading, variant = "primary", className, children, disabled, ...props }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
