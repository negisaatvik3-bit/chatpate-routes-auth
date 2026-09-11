import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthInput, PasswordInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { handleAdminLogin, handleLogin } from "@/lib/auth";

interface Errors {
  email?: string;
  password?: string;
}

export function LoginForm({ variant = "user" }: { variant?: "user" | "admin" }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Errors = {};
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const fn = variant === "admin" ? handleAdminLogin : handleLogin;
      await fn({ email: values.email.trim(), password: values.password });
      if (variant === "admin") {
        navigate({ to: "/admin/trips" });
      } else {
        navigate({ to: "/" });
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to log in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        {...(errors.email ? { error: errors.email } : {})}
      />
      <PasswordInput
        label="Password"
        autoComplete="current-password"
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        {...(errors.password ? { error: errors.password } : {})}
      />
      {formError ? (
        <p role="alert" className="px-2 text-xs text-destructive">
          {formError}
        </p>
      ) : null}
      <AuthSubmitButton loading={loading}>Log In</AuthSubmitButton>
    </form>
  );
}
