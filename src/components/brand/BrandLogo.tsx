import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/images/logo.png";

/** Intrinsic dimensions for Next/Image — supports retina up to 100px display height */
const LOGO_WIDTH = 560;
const LOGO_HEIGHT = 100;

interface BrandLogoProps {
  /** `#home` on homepage, `/#home` from inner pages */
  href?: string;
  className?: string;
  /** Override default responsive logo heights (e.g. footer) */
  imageClassName?: string;
}

export function BrandLogo({
  href = "#home",
  className = "",
  imageClassName = "h-[55px] md:h-[70px] lg:h-[90px] xl:h-[100px]",
}: BrandLogoProps) {
  const logo = (
    <span className={`group relative inline-flex shrink-0 items-center ${className}`}>
      <Image
        src={LOGO_SRC}
        alt="Home"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
        className={`relative w-auto object-contain transition-[filter] duration-300 group-hover:brightness-110 ${imageClassName}`}
        style={{ filter: "drop-shadow(0 0 15px rgba(59,130,246,0.4))" }}
        sizes="(max-width: 768px) 220px, (max-width: 1024px) 300px, 380px"
      />
    </span>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className="flex items-center py-0.5" aria-label="Go to home">
        {logo}
      </Link>
    );
  }

  return (
    <a href={href} className="flex items-center py-0.5" aria-label="Go to home">
      {logo}
    </a>
  );
}
