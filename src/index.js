import React, { useState } from "react";
import { createRoot } from "react-dom/client"; //
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import "./styles.css";

const API_KEY = "c6f8ef4575250284954db9f4dfa7a996";

function mapIcon(code) {
  switch (code) {
    case "01d":
      return "CLEAR_DAY";
    case "01n":
      return "CLEAR_NIGHT";
    case "02d":
      return "PARTLY_CLOUDY_DAY";
    case "02n":
      return "PARTLY_CLOUDY_NIGHT";
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return "CLOUDY";
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return "RAIN";
    case "11d":
    case "11n":
      return "WIND";
    case "13d":
    case "13n":
      return "SNOW";
    case "50d":
    case "50n":
      return "FOG";
    default:
      return "CLOUDY";
  }
}

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  async function handleSearch(e) {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setStatus("loading");
      setData(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim()
      )}&units=metric&appid=${API_KEY}`;

      const res = await axios.get(url);
      const weather = res.data.weather?.[0];

      setData({
        tempC: Math.round(res.data.main.temp),
        description: weather?.description ?? "—",
        humidity: res.data.main.humidity,
        windKmh: (res.data.wind.speed * 3.6).toFixed(2),
        icon: mapIcon(weather?.icon),
      });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a city.."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {status === "loading" && <p className="muted">Loading…</p>}
      {status === "error" && <p className="error">Couldn’t find that city.</p>}

      {data && (
        <>
          <ul className="details">
            <li>Temperature: {data.tempC}°C</li>
            <li>Description: {data.description}</li>
            <li>Humidity: {data.humidity}%</li>
            <li>Wind: {data.windKmh}km/h</li>
          </ul>
          <div className="iconWrap">
            <ReactAnimatedWeather
              icon={data.icon}
              color="#ff6b4a"
              size={96}
              animate
            />
          </div>
        </>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
