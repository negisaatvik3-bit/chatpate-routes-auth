import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export function AdminSignInPage() {
  return (
    <AuthLayout footer="Authorized administrators only.">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Welcome back, Admin
        </h1>
      </div>

      <div className="mt-8">
        <GoogleSignInButton returnPath="/admin/trips" admin />
      </div>
    </AuthLayout>
  );
}
