import { clsx } from "clsx";
import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
            "bg-white dark:bg-gray-900 dark:text-white",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
