import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integerations/supabase/client";
import { handleLogout } from "@/lib/auth";
import "./Navbar.css";

type NavbarProps = {
  activePage?: "trips" | "about" | "contact";
};

type AccountState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "unavailable" }
  | {
      status: "signed-in";
      email: string;
      role: "checking" | "admin" | "user" | "unavailable";
    };

const LOGIN_HREF = "/login?redirect=%2Ftrips";

const navItems = [
  { href: "/trips", label: "Trips", num: "01", page: "trips" },
  { href: "/#about", label: "About", num: "02", page: "about" },
  { href: "/contact", label: "Contact", num: "03", page: "contact" },
] as const;

export function Navbar({ activePage }: NavbarProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [account, setAccount] = useState<AccountState>({ status: "loading" });
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    const syncAccount = (session: Session | null) => {
      const currentRequestId = ++requestId;

      if (!session) {
        setAccount({ status: "signed-out" });
        return;
      }

      const email = session.user.email ?? "Google account";
      setAccount({ status: "signed-in", email, role: "checking" });

      void fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      })
        .then(async (response) => {
          if (!response.ok) throw new Error("Account role could not be checked.");
          return (await response.json()) as { isAdmin?: boolean };
        })
        .then((result) => {
          if (!active || currentRequestId !== requestId) return;
          setAccount({
            status: "signed-in",
            email,
            role: result.isAdmin === true ? "admin" : "user",
          });
        })
        .catch(() => {
          if (!active || currentRequestId !== requestId) return;
          setAccount({ status: "signed-in", email, role: "unavailable" });
        });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer work out of Supabase's auth callback to avoid blocking auth events.
      window.setTimeout(() => {
        if (active) syncAccount(session);
      }, 0);
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!active) return;
        if (error) {
          setAccount({ status: "unavailable" });
          return;
        }
        syncAccount(session);
      })
      .catch(() => {
        if (active) setAccount({ status: "unavailable" });
      });

    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen]);

  const signOut = async () => {
    setSignOutError("");
    setIsSigningOut(true);

    try {
      await handleLogout();
      closeMenu();
    } catch {
      setSignOutError("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const isSignedIn = account.status === "signed-in";
  const email = isSignedIn ? account.email : "";
  const isAdmin = isSignedIn && account.role === "admin";

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <a href="/" className="nav-brand" onClick={closeMenu}>
          Chatpate Routes
        </a>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={activePage === item.page ? "active" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
          {account.status === "loading" ? (
            <li className="nav-account-status" aria-live="polite">
              Checking account…
            </li>
          ) : account.status === "unavailable" ? (
            <>
              <li className="nav-account-status" aria-live="polite">
                Account status unavailable
              </li>
              <li>
                <a href={LOGIN_HREF} className="nav-cta" onClick={closeMenu}>
                  Sign in
                </a>
              </li>
            </>
          ) : account.status === "signed-out" ? (
            <>
              <li>
                <a href={LOGIN_HREF} className="nav-cta" onClick={closeMenu}>
                  Join Trip
                </a>
              </li>
              <li>
                <a href={LOGIN_HREF} className="nav-sign-in" onClick={closeMenu}>
                  Sign in
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-account-email" title={email}>
                Signed in as {email}
              </li>
              <li>
                <a href="/dashboard/bookings" onClick={closeMenu}>
                  My Bookings
                </a>
              </li>
              {isAdmin ? (
                <li>
                  <a href="/admin/trips" onClick={closeMenu}>
                    Admin
                  </a>
                </li>
              ) : null}
              <li>
                <button
                  type="button"
                  className="nav-sign-out"
                  onClick={signOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing out…" : "Sign out"}
                </button>
              </li>
            </>
          )}
        </ul>

        <button
          type="button"
          className="hamburger"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`mobile-menu${isMenuOpen ? " active" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-top">
          <a href="/" className="mobile-menu-brand" onClick={closeMenu}>
            Chatpate Routes
          </a>
          <button type="button" className="menu-close" onClick={closeMenu} aria-label="Close menu">
            <span />
            <span />
          </button>
        </div>

        <div className="mobile-menu-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activePage === item.page ? "active" : undefined}
              onClick={closeMenu}
            >
              <span>{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>

        <div className="mobile-account" aria-live="polite">
          {account.status === "loading" ? (
            <p className="mobile-account-status">Checking account…</p>
          ) : account.status === "unavailable" ? (
            <>
              <p className="mobile-account-status">Account status unavailable</p>
              <a href={LOGIN_HREF} onClick={closeMenu}>
                Sign in
              </a>
            </>
          ) : account.status === "signed-out" ? (
            <a href={LOGIN_HREF} onClick={closeMenu}>
              Sign in with Google
            </a>
          ) : (
            <>
              <p className="mobile-account-email">
                Signed in as <strong>{email}</strong>
              </p>
              <a href="/dashboard/bookings" onClick={closeMenu}>
                My Bookings
              </a>
              {isAdmin ? (
                <a href="/admin/trips" onClick={closeMenu}>
                  Admin
                </a>
              ) : account.role === "checking" ? (
                <span className="mobile-account-status">Checking admin access…</span>
              ) : null}
              <button type="button" onClick={signOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          )}
        </div>

        <a
          href={isSignedIn ? "/trips" : LOGIN_HREF}
          className="mobile-menu-cta"
          onClick={closeMenu}
        >
          {isSignedIn ? "BROWSE TRIPS" : "FIND MY TRIP"}
        </a>
        {signOutError ? (
          <p className="nav-auth-error" role="alert">
            {signOutError}
          </p>
        ) : null}
      </div>
    </>
  );
}

export default Navbar;
