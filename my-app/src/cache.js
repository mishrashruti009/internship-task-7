export function saveToCache(city, data) {
  localStorage.setItem(city, JSON.stringify(data));
}

export function getFromCache(city) {
  const data = localStorage.getItem(city);
  return data ? JSON.parse(data) : null;
}