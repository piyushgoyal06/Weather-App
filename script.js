const cityNameElem = document.querySelector(".city-name");
const dateTimeElem = document.querySelector(".date-time");
const forecastTextElem = document.querySelector(".forecast-text");
const forecastIconElem = document.querySelector(".forecast-icon");
const temperatureElem = document.querySelector(".temperature");
const minTempElem = document.querySelector(".min-temp");
const maxTempElem = document.querySelector(".max-temp");

const feelsLikeElem = document.querySelector(".feels-like-value");
const humidityElem = document.querySelector(".humidity-value");
const windElem = document.querySelector(".wind-value");
const pressureElem = document.querySelector(".pressure-value");

const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("cityInput");

const getCountryName = (code) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
  } catch {
    return code;
  }
};

const getDateTime = (timezone) => {
  const nowUTC = Date.now() + new Date().getTimezoneOffset() * 60000;
  const localTime = nowUTC + timezone * 1000;
  const curDate = new Date(localTime);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("en-US", options).format(curDate);
};

let city = "Delhi";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputText = searchInput.value.trim();
  if (!inputText) return;
  city = inputText;
  fetchWeatherData();
  searchInput.value = "";
});

const fetchWeatherData = async () => {
  const apiKey = "21998b5f7ec947b28309f2c2a811ddad";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("City not found.");
    const data = await res.json();

    const { main, name, weather, wind, sys, timezone } = data;
    cityNameElem.textContent = `${name}, ${getCountryName(sys?.country) ?? ""}`;
    dateTimeElem.textContent = getDateTime(timezone);
    forecastTextElem.textContent = weather?.[0]?.description ?? "--";
    temperatureElem.textContent = main ? `${Math.round(main.temp)}°C` : "--";
    minTempElem.textContent = main ? `Min: ${Math.round(main.temp_min)}°C` : "";
    maxTempElem.textContent = main ? `Max: ${Math.round(main.temp_max)}°C` : "";
    feelsLikeElem.textContent = main ? `${main.feels_like.toFixed(1)}°C` : "--";
    humidityElem.textContent = main ? `${main.humidity}%` : "--";
    windElem.textContent = wind ? `${wind.speed} m/s` : "--";
    pressureElem.textContent = main ? `${main.pressure} hPa` : "--";

    if (weather && weather[0] && weather[0].icon) {
      forecastIconElem.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" width="100" height="100" />`;
    } else {
      forecastIconElem.innerHTML = "";
    }

  } catch (error) {
    alert("City not found. Please enter a valid city name.");
  }
};

window.addEventListener("DOMContentLoaded", fetchWeatherData);
