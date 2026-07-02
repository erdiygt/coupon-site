interface RateLimitRecord {
  count: number;
  resetAt: number;
}

declare global {
  var __rateLimitStore: Map<string, RateLimitRecord> | undefined;
}

function getMemoryStore(): Map<string, RateLimitRecord> {
  if (!global.__rateLimitStore) {
    global.__rateLimitStore = new Map();
  }
  return global.__rateLimitStore;
}

function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const store = getMemoryStore();
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, retryAfterSeconds: 0 };
}

type UpstashLimiter = {
  limit: (key: string) => Promise<{
    success: boolean;
    reset: number;
  }>;
};

const limiterCache = new Map<string, UpstashLimiter | null>();

async function getLimiterForConfig(
  maxRequests: number,
  windowMs: number,
): Promise<UpstashLimiter | null> {
  const cacheKey = `${maxRequests}:${windowMs}`;
  if (limiterCache.has(cacheKey)) {
    return limiterCache.get(cacheKey) ?? null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    limiterCache.set(cacheKey, null);
    return null;
  }

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSec} s`),
      prefix: "indirim-kodu",
    });
    limiterCache.set(cacheKey, limiter);
    return limiter;
  } catch {
    limiterCache.set(cacheKey, null);
    return null;
  }
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const limiter = await getLimiterForConfig(maxRequests, windowMs);

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      if (result.success) {
        return { allowed: true, retryAfterSeconds: 0 };
      }
      const retryAfterSeconds = Math.max(
        0,
        Math.ceil((result.reset - Date.now()) / 1000),
      );
      return { allowed: false, retryAfterSeconds };
    } catch {
      // Upstash hatasında bellek içi fallback
    }
  }

  return checkMemoryRateLimit(key, maxRequests, windowMs);
}

export const SEARCH_RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60_000,
} as const;

export const ADMIN_MUTATION_RATE_LIMIT = {
  maxRequests: 60,
  windowMs: 60_000,
} as const;

export const CONTACT_FORM_RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 15 * 60_000,
} as const;
