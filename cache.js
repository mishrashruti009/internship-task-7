const CACHE_TIME = 10 * 60 * 1000;

export function saveToCache(city, data) {
  localStorage.setItem(city, JSON.stringify({
    data,
    time: Date.now()
  }));
}

export function getFromCache(city) {
  const item = localStorage.getItem(city);
  if (!item) return null;

  const parsed = JSON.parse(item);

  if (Date.now() - parsed.time > CACHE_TIME) {
    localStorage.removeItem(city);
    return null;
  }

  return parsed.data;
}