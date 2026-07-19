// Token Bucket Rate Limiter
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private static buckets = new Map<string, TokenBucket>();
  private static capacity = 100; // max requests per window
  private static refillRate = 10; // tokens per second

  static check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(key, bucket);
    } else {
      // Refill tokens
      const elapsedSeconds = (now - bucket.lastRefill) / 1000;
      const tokensToAdd = elapsedSeconds * this.refillRate;
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return { allowed: true, remaining: Math.floor(bucket.tokens) };
    }

    return { allowed: false, remaining: 0 };
  }
}
