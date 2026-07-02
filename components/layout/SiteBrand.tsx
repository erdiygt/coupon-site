import Image from "next/image";
import Link from "next/link";

interface SiteBrandProps {
  siteName: string;
  logoUrl?: string;
}

export default function SiteBrand({ siteName, logoUrl }: SiteBrandProps) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={siteName}
        width={200}
        height={40}
        priority
        className="h-9 w-auto max-w-[200px] object-contain object-left"
      />
    );
  }

  const accentLength = Math.min(4, siteName.length);
  const accent = siteName.slice(-accentLength);
  const prefix = siteName.slice(0, -accentLength);

  return (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
        %
      </span>
      <span className="text-xl font-bold text-foreground">
        {prefix}
        <span className="text-primary">{accent}</span>
      </span>
    </>
  );
}

interface SiteBrandLinkProps extends SiteBrandProps {
  className?: string;
}

export function SiteBrandLink({ siteName, logoUrl, className = "" }: SiteBrandLinkProps) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 ${className}`.trim()}>
      <SiteBrand siteName={siteName} logoUrl={logoUrl} />
    </Link>
  );
}
