// Simple memoization utility
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Cache with TTL (Time To Live)
export function createCacheWithTTL<T>(ttlMs: number = 5 * 60 * 1000) {
  const cache = new Map<string, { value: T; timestamp: number }>();

  return {
    get(key: string): T | null {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > ttlMs) {
        cache.delete(key);
        return null;
      }
      
      return item.value;
    },
    
    set(key: string, value: T): void {
      cache.set(key, { value, timestamp: Date.now() });
    },
    
    clear(): void {
      cache.clear();
    },
    
    delete(key: string): boolean {
      return cache.delete(key);
    }
  };
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 