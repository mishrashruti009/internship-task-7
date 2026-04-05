const WEATHER_API_KEY = "8fc107045647004fe0ece706442a2998";
const NEWS_API_KEY = "b062aa04a78146a2a1f4da11e9835c1c";

// WEATHER
export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  return data;
}

// NEWS (with proxy fix)
export async function fetchNews(city) {
  const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`;

  const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
  const data = await res.json();

  if (!res.ok) throw new Error("News error");
  return data;
}



