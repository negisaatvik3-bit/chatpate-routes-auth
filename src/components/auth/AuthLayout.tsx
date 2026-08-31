import type { ReactNode } from "react";
import travelImage from "@/assets/auth-travel.jpg";
import { AuthBrand } from "./AuthBrand";

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  brandSuffix?: string;
  imageCaption?: string;
  imageTitle?: string;
}

export function AuthLayout({
  children,
  footer,
  brandSuffix,
  imageTitle = "Spiti Valley",
  imageCaption = "Curated group trips across the Himalayas",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-5 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1280px] flex-col overflow-hidden rounded-3xl bg-card shadow-[0_24px_60px_-30px_oklch(0.3_0.05_158_/_0.45)] lg:min-h-[calc(100vh-3rem)] lg:flex-row">
        <div className="order-2 flex w-full flex-col items-center justify-between gap-8 px-6 py-10 sm:px-10 lg:order-1 lg:w-[42%] lg:px-12 lg:py-12">
          <AuthBrand suffix={brandSuffix} />
          <div className="w-full max-w-sm">{children}</div>
          <div className="text-center text-sm text-muted-foreground">{footer}</div>
        </div>

        <div className="order-1 w-full p-3 lg:order-2 lg:w-[58%] lg:p-3">
          <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-64 lg:h-full">
            <img
              src={travelImage}
              alt="Hikers looking over a Himalayan valley at golden hour"
              width={1024}
              height={1440}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-2xl border border-card/30 bg-card/25 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6">
              <p className="text-[11px] uppercase tracking-widest text-card">{imageCaption}</p>
              <p className="text-base font-semibold text-card">{imageTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
