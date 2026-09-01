import { Mountain } from "lucide-react";
import defaultImage from "@/assets/auth-travel.jpg";

interface Props {
  place: string;
  region: string;
  distance: string;
  distanceNote: string;
  trail: string;
  image?: string | undefined;
}

export function AuthImagePanel({
  place,
  region,
  distance,
  distanceNote,
  trail,
  image = defaultImage,
}: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <img
        src={image}
        alt="Trekkers overlooking a Himalayan valley at golden hour"
        width={1024}
        height={1440}
        className="h-full w-full object-cover"
      />

      {/* Pin 1 — destination */}
      <span className="absolute left-[46%] top-[18%] hidden h-2.5 w-2.5 rounded-full bg-card shadow-lg sm:block" />
      <span className="absolute left-[46.4%] top-[20%] hidden h-8 w-px bg-card/60 sm:block" />
      <div className="absolute left-[42%] top-[26%] hidden items-center gap-2.5 rounded-2xl border border-card/40 bg-card/25 px-3.5 py-2.5 shadow-[0_8px_32px_oklch(0_0_0_/_0.15)] backdrop-blur-md sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/30">
          <Mountain className="h-4 w-4 text-card" />
        </span>
        <span className="block leading-tight">
          <span className="block text-[10px] text-card/80">{region}</span>
          <span className="block text-[13px] font-bold text-card">{place}</span>
        </span>
      </div>

      {/* Pin 2 — distance */}
      <span className="absolute right-[17%] top-[57%] hidden h-2.5 w-2.5 rounded-full bg-card shadow-lg sm:block" />
      <span className="absolute right-[17.5%] top-[48%] hidden h-12 w-px bg-card/60 sm:block" />
      <div className="absolute right-[8%] top-[36%] hidden w-40 rounded-2xl border border-card/40 bg-card/25 px-3.5 py-2.5 shadow-[0_8px_32px_oklch(0_0_0_/_0.15)] backdrop-blur-md sm:block">
        <p className="text-[13px] font-bold text-card">{distance}</p>
        <p className="text-[11px] leading-tight text-card/80">{distanceNote}</p>
      </div>

      {/* Pin 3 — trail chip */}
      <span className="absolute bottom-[10%] left-[68.5%] hidden h-2.5 w-2.5 rounded-full bg-card shadow-lg sm:block" />
      <div className="absolute bottom-[14%] left-[63%] hidden rounded-full bg-card/85 px-4 py-1.5 text-xs font-bold text-foreground backdrop-blur-md sm:block">
        {trail}
      </div>
    </div>
  );
}
