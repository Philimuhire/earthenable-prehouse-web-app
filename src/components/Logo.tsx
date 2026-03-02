import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 80, height: 48 },
  md: { width: 120, height: 72 },
  lg: { width: 192, height: 128 },
};

export default function Logo({ size = "md" }: LogoProps) {
  const { width, height } = sizeMap[size];
  return (
    <Image
      src="/images/EE.png"
      alt="EarthEnable Logo"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  );
}
