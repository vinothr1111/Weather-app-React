
import { useState } from "react";
import axios from "axios";
import "./Weather.css";

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Enter a city name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
    
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&units=metric&appid=${API_KEY}`;
      const res = await axios.get(url);
      setWeather(res.data);
    } catch (err) {
      setWeather(null);
      if (err.response && err.response.status === 404) {
        setError("City not found. Check the spelling and try again.");
      } else {
        setError("Could not load weather. Check your connection or API key.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather">
      <header>
        <h1>Weather report</h1>
      </header>

      <form className="weather__form" onSubmit={search}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search a city, e.g. Coimbatore"
          aria-label="City name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="weather__error" role="alert">{error}</p>}

      {weather && (
        <section className="weather__card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p className="weather__temp">{Math.round(weather.main.temp)}°C</p>
          <p className="weather__desc">{weather.weather[0].description}</p>
          <dl className="weather__details">
            <div>
              <dt>Feels like</dt>
              <dd>{Math.round(weather.main.feels_like)}°C</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{weather.main.humidity}%</dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd>{weather.wind.speed} m/s</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
