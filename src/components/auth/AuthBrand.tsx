import { Link } from "@tanstack/react-router";

export function AuthBrand({
  suffix,
  tone = "dark",
}: {
  suffix?: string | undefined;
  tone?: "dark" | "light";
}) {
  return (
    <div className="flex w-fit items-center gap-2.5">
      <img
        src="/favicon.svg"
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm"
      />
      <Link
        to="/"
        className={`text-lg font-extrabold tracking-tight sm:text-xl ${
          tone === "light"
            ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]"
            : "text-[#165377]"
        }`}
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
