import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import WeatherDetails from "./WeatherDetails";
import Forecast from "./Forecast";
import ErrorMessage from "./ErrorMessage";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const CURRENT_URL =
  "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

function getErrorMessage(error) {
  if (!error.response) {
    return "Unable to connect to the weather service. Check your internet connection and try again.";
  }

  const status = error.response.status;

  if (status === 400) {
    return "Please enter a valid city name.";
  }

  if (status === 401) {
    return "Your API key is invalid or has not been activated. Check your OpenWeatherMap account.";
  }

  if (status === 403) {
    return "Your API subscription does not permit this request. Check your OpenWeatherMap plan and API access.";
  }

  if (status === 404) {
    return "We couldn't find that city. Check the spelling and try again.";
  }

  if (status === 429) {
    return "The API request limit has been reached. Please wait before trying again.";
  }

  return "Something went wrong while retrieving weather data. Please try again.";
}

function getLocalTime(timestamp, timezoneOffset) {
  if (
    typeof timestamp !== "number" ||
    typeof timezoneOffset !== "number"
  ) {
    return null;
  }

  const date = new Date(
    (timestamp + timezoneOffset) * 1000
  );

  return date.toISOString().slice(11, 16);
}

function getInsight(weather) {
  if (!weather || !weather.main || !weather.weather?.[0]) {
    return null;
  }

  const temperature = weather.main.temp;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind?.speed;
  const condition = weather.weather[0].main;
  const description = weather.weather[0].description;

  const insights = [];

  if (condition === "Rain" || condition === "Drizzle") {
    insights.push(
      "Rain is reported at your location. Consider carrying an umbrella."
    );
  } else if (condition === "Thunderstorm") {
    insights.push(
      "Thunderstorms are reported. Consider postponing outdoor activities."
    );
  } else if (condition === "Snow") {
    insights.push(
      "Snow is reported. Check local travel conditions before heading out."
    );
  } else if (condition === "Clear") {
    insights.push(
      "The reported sky condition is clear. Check the temperature before planning outdoor activities."
    );
  } else if (condition === "Clouds") {
    insights.push(
      "Cloud cover is reported. Conditions may be suitable for outdoor activities depending on local conditions."
    );
  } else {
    insights.push(
      `Current conditions are reported as ${description}.`
    );
  }

  if (typeof temperature === "number") {
    if (temperature >= 35) {
      insights.push(
        "It is very warm. Drink water regularly and limit strenuous activity in the heat."
      );
    } else if (temperature <= 10) {
      insights.push(
        "It is cold. Consider wearing additional layers when going outside."
      );
    }
  }

  if (typeof humidity === "number" && humidity >= 80) {
    insights.push(
      "Humidity is high. The air may feel muggy, especially in warm conditions."
    );
  }

  if (typeof windSpeed === "number" && windSpeed >= 10) {
    insights.push(
      "Wind speeds are elevated. Take care around exposed areas."
    );
  }

  return insights;
}

function WeatherApp() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
   // eslint-disable-next-line no-unused-vars
  const [hasSearched, setHasSearched] = useState(false);

  const requestId = useRef(0);
  const controllerRef = useRef(null);
  const activeRequestRef = useRef(false);
  const lastCityRef = useRef("");

  const fetchWeather = useCallback(async (cityName) => {
    const cleanCity = cityName.trim();

    if (!cleanCity) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError(
        "API key not found. Add REACT_APP_WEATHER_API_KEY to your .env file and restart the development server."
      );
      setHasSearched(true);
      return;
    }

    if (
      activeRequestRef.current &&
      lastCityRef.current.toLowerCase() === cleanCity.toLowerCase()
    ) {
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const currentRequestId = ++requestId.current;

    activeRequestRef.current = true;
    lastCityRef.current = cleanCity;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = {
        q: cleanCity,
        appid: API_KEY,
        units: unit
      };

      const [currentResponse, forecastResponse] =
        await Promise.all([
          axios.get(CURRENT_URL, {
            params,
            signal: controller.signal,
            timeout: 12000
          }),
          axios.get(FORECAST_URL, {
            params,
            signal: controller.signal,
            timeout: 12000
          })
        ]);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data.list || []);
      setSearchedCity(currentResponse.data.name);
      setCity(currentResponse.data.name);
    } catch (requestError) {
      if (
        requestError.code === "ERR_CANCELED" ||
        requestError.name === "CanceledError"
      ) {
        return;
      }

      if (currentRequestId === requestId.current) {
        setError(getErrorMessage(requestError));
      }
    } finally {
      if (currentRequestId === requestId.current) {
        activeRequestRef.current = false;
        setLoading(false);
      }
    }
  }, [unit]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (currentWeather && searchedCity) {
      fetchWeather(searchedCity);
    }

    // Refresh weather when the temperature unit changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const handleSearch = (searchCity) => {
    fetchWeather(searchCity);
  };

  const handleRetry = () => {
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const localTime = currentWeather
    ? getLocalTime(
        currentWeather.dt,
        currentWeather.timezone
      )
    : null;

  const insights = currentWeather
    ? getInsight(currentWeather)
    : [];

  const weatherCondition =
    currentWeather?.weather?.[0]?.main?.toLowerCase() || "";

  return (
    <div className={`weather-app weather-${weatherCondition}`}>
      <header className="topbar">
        <a
          href="#home"
          className="brand"
          aria-label="Atmosphere home"
        >
          <span className="brand-icon" aria-hidden="true">
            ◉
          </span>

          <span>
            atmos<span className="brand-accent">phere</span>
          </span>
        </a>

        <div className="header-right">
          <div className="today-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric"
            })}
          </div>

          <div
            className="unit-toggle"
            role="group"
            aria-label="Temperature unit"
          >
            <button
              type="button"
              className={unit === "metric" ? "active" : ""}
              aria-pressed={unit === "metric"}
              onClick={() => setUnit("metric")}
            >
              °C
            </button>

            <button
              type="button"
              className={unit === "imperial" ? "active" : ""}
              aria-pressed={unit === "imperial"}
              onClick={() => setUnit("imperial")}
            >
              °F
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="eyebrow">
          <span className="live-dot" />
          YOUR PERSONAL WEATHER SPACE
        </div>

        <h1>
          Weather,
          <br />
          <span>beautifully understood.</span>
        </h1>

        <p className="hero-description">
          A little more clarity about the world outside.
          <br className="desktop-break" />
          Discover the weather, wherever life takes you.
        </p>

        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={handleSearch}
          loading={loading}
        />
      </section>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
          showRetry={Boolean(city.trim()) && Boolean(API_KEY)}
        />
      )}

      {!currentWeather && !loading && !error && (
        <section className="empty-state">
          <div className="empty-orbit">
            <span className="empty-sun">☀</span>
            <span className="empty-cloud">☁</span>
          </div>

          <h2>Your forecast starts here</h2>

          <p>
            Search for a city to explore live weather conditions,
            atmospheric details, and the five-day outlook.
          </p>

          <div className="suggestion-row">
            <span>TRY A CITY</span>

            {["Chennai", "London", "Tokyo"].map((name) => (
              <button
                key={name}
                type="button"
                className="city-chip"
                onClick={() => {
                  setCity(name);
                  handleSearch(name);
                }}
              >
                {name}
                <span aria-hidden="true"> ↗</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {loading && !currentWeather && (
        <section className="loading-state" aria-live="polite">
          <div className="loading-orbit" />
          <p>Gathering atmospheric data...</p>
        </section>
      )}

      {currentWeather && (
        <div className="dashboard">
          <div className="section-heading">
            <div>
              <p className="section-kicker">YOUR WEATHER SNAPSHOT</p>

              <h2>
                {searchedCity}
                <span className="location-pin"> ↗</span>
              </h2>
            </div>

            <span className="live-label">
              <span className="live-dot" />
              LIVE CONDITIONS
            </span>
          </div>

          <CurrentWeather
            weather={currentWeather}
            unit={unit}
            localTime={localTime}
          />

          <WeatherDetails weather={currentWeather} />

          <Forecast forecast={forecast} unit={unit} />

          {insights.length > 0 && (
            <section className="insight-card">
              <div className="insight-icon" aria-hidden="true">
                ✦
              </div>

              <div className="insight-content">
                <p className="section-kicker">
                  ATMOSPHERE INSIGHTS
                </p>

                <h2>A little weather wisdom</h2>

                <ul>
                  {insights.map((insight, index) => (
                    <li key={`${index}-${insight}`}>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <p className="data-attribution">
            Weather data provided by{" "}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noreferrer"
            >
              OpenWeatherMap
            </a>
            .
          </p>
        </div>
      )}

      <footer className="footer">
        <a href="#home" className="footer-brand">
          atmos<span>phere</span>
        </a>

        <p>Find your moment in every forecast.</p>

        <span>Made for curious minds · 2026</span>
      </footer>
    </div>
  );
}

export default WeatherApp;