import "./style.css";
import { fetchWeather, fetchNews } from "./api.js";
import { saveToCache, getFromCache } from "./cache.js";

// elements
const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const newsDiv = document.getElementById("news");
const errorDiv = document.getElementById("error");
const greetingDiv = document.getElementById("greeting");
const datetimeDiv = document.getElementById("datetime");

// greeting
function setGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) greetingDiv.innerText = "☀ Good Morning";
  else if (hour < 18) greetingDiv.innerText = "🌤 Good Afternoon";
  else greetingDiv.innerText = "🌙 Good Evening";
}

// time
function updateTime() {
  datetimeDiv.innerText = new Date().toLocaleString();
}

setInterval(updateTime, 1000);
setGreeting();
updateTime();

// events
btn.addEventListener("click", handleSearch);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// main search
async function handleSearch() {
  const city = input.value.trim();
  if (!city) return;

  errorDiv.innerText = "";

  try {
    const cached = getFromCache(city);

    if (cached) {
      renderWeather(cached.weather);
      renderNews(cached.news);
      return;
    }

    const [weather, news] = await Promise.all([
      fetchWeather(city),
      fetchNews(city)
    ]);

    renderWeather(weather);
    renderNews(news);

    saveToCache(city, { weather, news });

  } catch (err) {
    errorDiv.innerText = "⚠️ Error fetching data";
    console.log(err);
  }
}

// UI
function renderWeather(data) {
  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <h1>${data.main.temp}°C</h1>
    <p>${data.weather[0].description}</p>
  `;
}

function renderNews(data) {
  newsDiv.innerHTML = "<h2>News</h2>" +
    data.articles.slice(0, 5).map(a => `
      <div onclick="window.open('${a.url}')">
        ${a.title}
      </div>
    `).join("");
}