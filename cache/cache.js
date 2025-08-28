const cache = new Map();

/**
 * Salva um valor no cache
 * @param {string} key
 * @param {any} value
 * @param {number} ttl Tempo de vida do cache em ms
 */
export const setCache = (key, value, ttl = 60000) => {
  const expires = Date.now() + ttl;
  cache.set(key, { value, expires });
};

/**
 * Busca um valor no cache
 * @param {string} key
 */
export const getCache = (key) => {
  const cached = cache.get(key);

  if (!cached) return null;

  if (Date.now() > cached.expires) {
    cache.delete(key); // Remove se expirou
    return null;
  }

  return cached.value;
};

/**
 * Remove um item do cache
 */
export const clearCache = (key) => {
  cache.delete(key);
};

/**
 * Limpa todo o cache
 */
export const clearAllCache = () => {
  cache.clear();
};
