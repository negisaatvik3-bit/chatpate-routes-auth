import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className="w-full text-left">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          placeholder={label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "w-full rounded-2xl border border-transparent bg-input px-5 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground",
            "focus:border-primary focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/25",
            error && "border-destructive",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 px-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
AuthInput.displayName = "AuthInput";

export const PasswordInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
      <div className="w-full text-left">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            placeholder={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "w-full rounded-2xl border border-transparent bg-input px-5 py-3.5 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground",
              "focus:border-primary focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/25",
              error && "border-destructive",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <Icon className="h-4 w-4" />
          </button>
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 px-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
