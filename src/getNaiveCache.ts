const naiveCacheMap = new Map();

const getNaivCache = <T>(
  cacheKey: string,
  defaultValue?: T
): {
  set: (value: T) => T;
  get: () => T;
  clear: (value?: T) => boolean;
} => {
  const get = () => naiveCacheMap.get(cacheKey);

  const set = (publicKey: T) => {
    naiveCacheMap.set(cacheKey, publicKey);

    return naiveCacheMap.get(cacheKey);
  };

  const clear = () => {
    naiveCacheMap.clear();

    return true;
  };

  if (defaultValue) {
    set(defaultValue);
  }

  return { get, set, clear };
};

export default getNaivCache;
