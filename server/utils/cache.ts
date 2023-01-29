import LRUCache from "lru-cache";

export const shortTermCache = new LRUCache({
  ttl: 1000 * 60 * 10,
  max: 10,
});

export const longTermCache = new LRUCache({
  ttl: 1000 * 60 * 60 * 24,
  max: 10,
});
