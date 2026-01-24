const axios = require("axios");

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Simple weather → seating rule
function decideSeating(weatherMain) {
  const badWeather = ["Rain", "Thunderstorm", "Snow"];

  if (badWeather.includes(weatherMain)) {
    return {
      seatingPreference: "indoor",
      suggestionText: "It might rain. Indoor seating would be more comfortable.",
    };
  }

  return {
    seatingPreference: "outdoor",
    suggestionText: "The weather looks pleasant. Outdoor seating would be great.",
  };
}

async function getWeatherForDate(date, city = "Gangtok") {
  const response = await axios.get(BASE_URL, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  const forecasts = response.data.list;

  // Convert booking date to timestamp
  const bookingTime = new Date(date).getTime();

  // Find closest forecast
  let closestForecast = forecasts[0];
  let minDiff = Math.abs(
    new Date(forecasts[0].dt_txt).getTime() - bookingTime
  );

  for (let forecast of forecasts) {
    const diff = Math.abs(
      new Date(forecast.dt_txt).getTime() - bookingTime
    );

    if (diff < minDiff) {
      minDiff = diff;
      closestForecast = forecast;
    }
  }

  const weatherMain = closestForecast.weather[0].main;

  return {
    weatherInfo: {
      condition: weatherMain,
      temperature: closestForecast.main.temp,
      description: closestForecast.weather[0].description,
    },
    ...decideSeating(weatherMain),
  };
}

module.exports = { getWeatherForDate };
