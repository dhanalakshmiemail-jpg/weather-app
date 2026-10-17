function formatTemperature(value) {
  if (typeof value !== "number") {
    return "--";
  }

  return Math.round(value);
}

function CurrentWeather({ weather, unit, localTime }) {
  if (!weather || !weather.main || !weather.weather?.[0]) {
    return null;
  }

  const {
    name,
    sys,
    main,
    weather: conditions,
    wind
  } = weather;

  const condition = conditions[0];

  const temperatureUnit = unit === "metric" ? "°C" : "°F";

  const high = formatTemperature(main.temp_max);
  const low = formatTemperature(main.temp_min);

  const iconUrl = condition.icon
    ? `https://openweathermap.org/img/wn/${condition.icon}@4x.png`
    : null;

  return (
    <section className="current-weather-card">
      <div className="current-weather-content">
        <div className="current-weather-top">
          <div>
            <p className="weather-label">CURRENT WEATHER</p>

            <h2 className="current-city">
              {name}
              {sys?.country ? (
                <span className="country-code">
                  {sys.country}
                </span>
              ) : null}
            </h2>

            {localTime && (
              <p className="local-time">
                Local time · {localTime}
              </p>
            )}
          </div>

          {iconUrl && (
            <img
              className="weather-icon"
              src={iconUrl}
              alt={condition.description || condition.main}
            />
          )}
        </div>

        <div className="temperature-display">
          <span className="temperature-value">
            {formatTemperature(main.temp)}
          </span>

          <span className="temperature-unit">
            {temperatureUnit}
          </span>
        </div>

        <p className="weather-condition">
          {condition.description}
        </p>

        <p className="feels-like">
          Feels like{" "}
          <strong>
            {formatTemperature(main.feels_like)}
            {temperatureUnit}
          </strong>
        </p>

        <div className="high-low-row">
          <div>
            <span aria-hidden="true">↗</span>
            <span>High</span>
            <strong>
              {high}
              {temperatureUnit}
            </strong>
          </div>

          <div className="high-low-divider" />

          <div>
            <span aria-hidden="true">↘</span>
            <span>Low</span>
            <strong>
              {low}
              {temperatureUnit}
            </strong>
          </div>
        </div>
      </div>

      <div className="weather-decoration" aria-hidden="true">
        <div className="decoration-orbit orbit-one" />
        <div className="decoration-orbit orbit-two" />
        <div className="decoration-glow" />
      </div>

      {wind && typeof wind.speed === "number" && (
        <div className="current-wind">
          <span aria-hidden="true">↗</span>
          Wind {wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </div>
      )}
    </section>
  );
}

export default CurrentWeather;