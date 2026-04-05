import { fetchWeather, fetchNews } from "./api.js";
import { saveToCache, getFromCache } from "./cache.js";

const input = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");
const newsDiv = document.getElementById("news");
const errorDiv = document.getElementById("error");
const datetimeDiv = document.getElementById("datetime");
const greetingDiv = document.getElementById("greeting");

// 🔍 search
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// 🕒 DATE + TIME
function updateDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const time = now.toLocaleTimeString();

  datetimeDiv.textContent = `${date} • ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// 👋 GREETING
function updateGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) greetingDiv.textContent = "☀ Good Morning";
  else if (hour < 18) greetingDiv.textContent = "🌤 Good Afternoon";
  else greetingDiv.textContent = "🌙 Good Evening";
}

updateGreeting();

// 🎨 BACKGROUND
function setBackground(condition) {
  if (condition.includes("cloud")) {
    document.body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
  } else if (condition.includes("rain")) {
    document.body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
  } else if (condition.includes("clear")) {
    document.body.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
  } else {
    document.body.style.background = "linear-gradient(135deg, #1e1e2f, #2c2c54)";
  }
}

// 🔥 MAIN
async function handleSearch() {
  const city = input.value.trim();
  if (!city) return;

  hideError();

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
    console.log("API failed → demo mode");

    // fallback
    const weather = {
      name: city,
      main: { temp: 25, humidity: 60, feels_like: 26 },
      wind: { speed: 5 },
      weather: [{ description: "clear sky", icon: "01d", main: "Clear" }]
    };

    const news = {
      articles: [
        { title: `${city} latest updates`, url: "#" },
        { title: `Weather news in ${city}`, url: "#" },
        { title: `Breaking news from ${city}`, url: "#" }
      ]
    };

    renderWeather(weather);
    renderNews(news);

    showError("⚠️ Using demo data (API issue)");
  }
}

// 🌤 WEATHER
function renderWeather(data) {
  const icon = data.weather[0].icon;
  const condition = data.weather[0].main.toLowerCase();

  setBackground(condition);

  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
    <div class="weather-temp">${data.main.temp}°C</div>
    <p>${data.weather[0].description}</p>

    <div class="details">
      <div class="detail-box">💧 ${data.main.humidity}%</div>
      <div class="detail-box">💨 ${data.wind.speed} m/s</div>
      <div class="detail-box">🌡 ${data.main.feels_like}°C</div>
      <div class="detail-box">📍 ${data.name}</div>
    </div>
  `;
}

// 📰 NEWS
function renderNews(data) {
  newsDiv.innerHTML = "<h2>📰 News</h2>" +
    data.articles.slice(0, 5).map(a => `
      <div class="news-item" onclick="window.open('${a.url}','_blank')">
        ${a.title}
      </div>
    `).join("");
}

// UI
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}