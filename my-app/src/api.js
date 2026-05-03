const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
const NEWS_KEY = import.meta.env.VITE_NEWS_KEY;

export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function fetchNews(city) {
  const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_KEY}`;

  const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
  const data = await res.json();

  return data;
}

