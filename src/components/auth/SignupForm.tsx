import { useState } from "react";
import { AuthInput, PasswordInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { handleSignup } from "@/lib/auth";

type Field = "fullName" | "email" | "password" | "confirmPassword";

export function SignupForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.fullName.trim()) next.fullName = "Full name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Password is required.";
    else if (values.password.length < 8)
      next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password))
      next.password = "Include at least one letter and one number.";
    if (!values.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (values.confirmPassword !== values.password)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await handleSignup({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign up right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <AuthInput
        label="Full name"
        autoComplete="name"
        value={values.fullName}
        onChange={set("fullName")}
        {...(errors.fullName ? { error: errors.fullName } : {})}
      />
      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={set("email")}
        {...(errors.email ? { error: errors.email } : {})}
      />
      <PasswordInput
        label="Password"
        autoComplete="new-password"
        value={values.password}
        onChange={set("password")}
        {...(errors.password ? { error: errors.password } : {})}
      />
      <PasswordInput
        label="Confirm password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={set("confirmPassword")}
        {...(errors.confirmPassword ? { error: errors.confirmPassword } : {})}
      />
      {formError ? (
        <p role="alert" className="px-2 text-xs text-destructive">
          {formError}
        </p>
      ) : null}
      <AuthSubmitButton loading={loading}>Create Account</AuthSubmitButton>
    </form>
  );
}
