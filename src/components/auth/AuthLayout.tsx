import type { ReactNode } from "react";
import { AuthBrand } from "./AuthBrand";
import { AuthImagePanel } from "./AuthImagePanel";

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  brandSuffix?: string | undefined;
  place?: string;
  region?: string;
  distance?: string;
  distanceNote?: string;
  trail?: string;
}

export function AuthLayout({
  children,
  footer,
  brandSuffix,
  place = "Chandratal Camp",
  region = "Spiti Valley",
  distance = "1.2 km",
  distanceNote = "left to your basecamp",
  trail = "Hampta Pass Trail",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="flex w-full max-w-[1080px] flex-col overflow-hidden rounded-3xl bg-card shadow-[0_20px_40px_oklch(0_0_0_/_0.08)] lg:h-[min(680px,calc(100vh-2.5rem))] lg:flex-row">
        <div className="flex w-full flex-col items-center justify-between gap-8 px-6 py-10 sm:px-10 lg:w-[40%] lg:px-10 lg:py-12">
          <AuthBrand suffix={brandSuffix} />
          <div className="w-full max-w-[300px] text-center">{children}</div>
          <div className="text-center text-[13px] text-foreground">{footer}</div>
        </div>

        <div className="hidden p-3 lg:block lg:w-[60%]">
          <AuthImagePanel
            place={place}
            region={region}
            distance={distance}
            distanceNote={distanceNote}
            trail={trail}
          />
        </div>
      </div>
    </div>
  );
}
