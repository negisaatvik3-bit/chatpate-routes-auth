import { Link } from "@tanstack/react-router";

export function AuthBrand({ suffix }: { suffix?: string | undefined }) {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Link
        to="/login"
        className="text-lg font-extrabold tracking-tight text-[#87CEEB]"
      >
        Chatpate Routes
      </Link>
      {suffix ? (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
