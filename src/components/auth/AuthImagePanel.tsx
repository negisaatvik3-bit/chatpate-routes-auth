import defaultImage from "@/assets/auth-login-pic.jpeg";

interface Props {
  place?: string;
  region?: string;
  distance?: string;
  distanceNote?: string;
  trail?: string;
  image?: string | undefined;
}

export function AuthImagePanel({ image = defaultImage }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <img
        src={image}
        alt="Mountain landscape"
        className="h-full w-full object-cover"
      />
    </div>
  );
}