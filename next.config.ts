import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

function hostnameFromEnv(url?: string): string | undefined {
  try {
    return url ? new URL(url).hostname : undefined;
  } catch {
    return undefined;
  }
}

const supabaseHost = hostnameFromEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const upstashHost = hostnameFromEnv(process.env.UPSTASH_REDIS_REST_URL);

function buildCsp(): string {
  const connectSrc = [
    "'self'",
    ...(supabaseHost ? [`https://${supabaseHost}`] : []),
    ...(upstashHost ? [`https://${upstashHost}`] : []),
  ];

  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = isProd ? "'self'" : "'self' 'unsafe-inline' 'unsafe-eval'";

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    `connect-src ${connectSrc.join(" ")}`,
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "script-src-attr 'none'",
  ];

  if (isProd) {
    directives.push("upgrade-insecure-requests");
    directives.push("block-all-mixed-content");
  }

  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: buildCsp() },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    imageSizes: [32, 40, 48, 56, 64, 80, 96, 128, 200],
    deviceSizes: [200, 384, 640],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
