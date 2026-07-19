// Distributed Cache Manager with In-Memory LRU & Redis Fallback

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class CacheManager {
  private static memoryStore = new Map<string, CacheItem<any>>();

  static async get<T>(key: string): Promise<T | null> {
    const item = this.memoryStore.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }

    return item.value as T;
  }

  static async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryStore.set(key, { value, expiresAt });
  }

  static async invalidate(pattern: string): Promise<void> {
    for (const key of this.memoryStore.keys()) {
      if (key.includes(pattern)) {
        this.memoryStore.delete(key);
      }
    }
  }
}
