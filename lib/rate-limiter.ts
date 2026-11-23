import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory sliding window fallback for local development or when Upstash credentials are not set
interface MemoryRecord {
  count: number;
  resetAt: number;
}
const inMemoryStore = new Map<string, MemoryRecord>();

function cleanupMemoryStore() {
  const now = Date.now();
  for (const [key, record] of inMemoryStore.entries()) {
    if (record.resetAt <= now) {
      inMemoryStore.delete(key);
    }
  }
}

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      // 3 requests per 10 minutes (600 seconds)
      limiter: Ratelimit.slidingWindow(3, '600 s'),
      analytics: false,
      prefix: 'portfolio:ratelimit:contact',
    });
  } catch (err) {
    console.warn('[RateLimit] Failed to initialize Upstash Redis, falling back to in-memory limiter', err);
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // timestamp in ms
  retryAfter: number; // in seconds
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes (600,000 ms)
  const MAX_REQUESTS = 3;

  if (upstashRatelimit) {
    try {
      const res = await upstashRatelimit.limit(identifier);
      const retryAfterSeconds = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000));
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
        retryAfter: retryAfterSeconds,
      };
    } catch (err) {
      console.warn('[RateLimit] Upstash error, using in-memory fallback:', err);
    }
  }

  // In-memory fallback
  cleanupMemoryStore();
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  if (!record || record.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    inMemoryStore.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: resetAt,
      retryAfter: 0,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: record.resetAt,
      retryAfter: retryAfterSeconds,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - record.count,
    reset: record.resetAt,
    retryAfter: 0,
  };
}
