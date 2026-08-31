import { handleAppleLogin, handleFacebookLogin, handleGoogleLogin } from "@/lib/auth";

interface Props {
  onError?: (message: string) => void;
  disabled?: boolean;
}

export function SocialAuthButtons({ onError, disabled }: Props) {
  const run = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Sign-in is unavailable right now.");
    }
  };

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full bg-card transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50";

  return (
    <div className="mx-auto flex w-48 items-center justify-evenly rounded-full bg-secondary px-3 py-2">
      <button
        type="button"
        aria-label="Continue with Apple"
        disabled={disabled}
        onClick={() => run(handleAppleLogin)}
        className={buttonClass}
      >
        <svg width="17" height="17" viewBox="0 0 170 170" fill="currentColor" className="text-foreground">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.13-9.74-1.98-14.76-6.35-3.17-2.76-7.05-7.44-11.64-14.04-5.91-8.52-10.45-17.75-13.62-27.68-3.17-9.93-4.76-19.53-4.76-28.8 0-14.88 3.84-27.12 11.51-36.72 7.67-9.6 17.51-14.46 29.53-14.58 4.7 0 9.87 1.18 15.52 3.54 5.65 2.36 9.48 3.54 11.5 3.54 1.74 0 5.75-1.24 12.02-3.73 6.27-2.49 11.57-3.61 15.9-3.35 12.55.9 22.56 5.65 30.03 14.25-11.01 6.66-16.39 15.84-16.14 27.53.25 9.17 3.76 16.8 10.53 22.88 6.77 6.08 14.94 9.48 24.51 10.2-2.5 7.42-5.98 15.22-10.44 23.4zM119.22 31.08c0-7.09 2.58-13.79 7.74-20.1 5.16-6.31 11.66-10.22 19.5-11.73-.25 1.01-.38 2.02-.38 3.03 0 6.96-2.6 13.67-7.8 20.13-5.2 6.46-11.75 10.4-19.65 11.82-.13-.9-.21-1.95-.21-3.15z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Continue with Google"
        disabled={disabled}
        onClick={() => run(handleGoogleLogin)}
        className={buttonClass}
      >
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 8.28 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.28 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Continue with Facebook"
        disabled={disabled}
        onClick={() => run(handleFacebookLogin)}
        className={buttonClass}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
    </div>
  );
}
