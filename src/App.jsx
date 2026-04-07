import React, { useState } from "react";
import "./App.css";
import axiosInstance from "../api/axios";
import { endPoints } from "../api/endPoints";

const API_KEY = "e479261a5ef3e6ab78a63936233ad813";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);


  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const weatherRes = await axiosInstance.get(
        `${endPoints.WEATHER}?q=${city}&appid=${API_KEY}&units=metric`
      );


      const forecastRes = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(weatherRes.data);

      const dailyData = forecastRes.data.list.filter((item, index) => index % 8 === 0);

      setForecast(dailyData);
      setCity("");
    } catch (err) {
      setError("City not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌦 Weather Dashboard</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city (e.g. Kolkata)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-container">
          {/* TOP SECTION */}
          <div className="main-card">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <h1>{weather.main.temp}°C</h1>
            <p className="desc">{weather.weather[0].description}</p>
          </div>

          {/* GRID DATA */}
          <div className="grid">
            <div className="card">
              <h3>Max Temp</h3>
              <p>{weather.main.temp_max} °C</p>
            </div>

            <div className="card">
              <h3>Min Temp</h3>
              <p>{weather.main.temp_min} °C</p>
            </div>

            <div className="card">
              <h3>Humidity</h3>
              <p>{weather.main.humidity}%</p>
            </div>

            <div className="card">
              <h3>Pressure</h3>
              <p>{weather.main.pressure} hPa</p>
            </div>

            <div className="card">
              <h3>Sunrise</h3>
              <p>
                {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
            </div>

            <div className="card">
              <h3>Sunset</h3>
              <p>
                {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}


      {forecast.length > 0 && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>

          <div className="forecast-row">
            {forecast.map((item, index) => (
              <div key={index} className="forecast-card">
                <h4>
                  {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </h4>

                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="icon"
                />

                <p>{item.main.temp}°C</p>
                <p className="small">{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;