import defaultImage from "@/assets/auth-login-pic.jpeg";

interface Props {
  place?: string;
  region?: string;
  distance?: string;
  distanceNote?: string;
  trail?: string;
  image?: string | undefined;
  className?: string;
}

export function AuthImagePanel({
  image = defaultImage,
  className = "",
}: Props) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      <img
        src={image}
        alt="Mountain landscape"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
