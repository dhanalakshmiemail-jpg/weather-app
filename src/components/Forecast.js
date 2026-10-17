function getDateKey(timestamp, timezoneOffset) {
  return new Date(
    (timestamp + timezoneOffset) * 1000
  )
    .toISOString()
    .slice(0, 10);
}

function getDayName(timestamp, timezoneOffset) {
  const date = new Date(
    (timestamp + timezoneOffset) * 1000
  );

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC"
  });
}

function buildDailyForecast(forecast) {
  if (!forecast.length) {
    return [];
  }

  const timezoneOffset =
    forecast[0].timezoneOffset || 0;

  const grouped = {};

  forecast.forEach((entry) => {
    const key = getDateKey(
      entry.dt,
      timezoneOffset
    );

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(entry);
  });

  return Object.entries(grouped)
    .map(([date, entries]) => {
      const representative = entries.reduce(
        (closest, entry) => {
          const entryHour = new Date(
            (entry.dt + timezoneOffset) * 1000
          ).getUTCHours();

          const closestHour = new Date(
            (closest.dt + timezoneOffset) * 1000
          ).getUTCHours();

          return Math.abs(entryHour - 12) <
            Math.abs(closestHour - 12)
            ? entry
            : closest;
        },
        entries[0]
      );

      const temperatures = entries
        .map((entry) => entry.main?.temp)
        .filter((temperature) => typeof temperature === "number");

      return {
        date,
        timestamp: representative.dt,
        condition: representative.weather?.[0],
        temp: representative.main?.temp,
        min: temperatures.length
          ? Math.min(...temperatures)
          : null,
        max: temperatures.length
          ? Math.max(...temperatures)
          : null
      };
    })
    .slice(0, 5);
}

function Forecast({ forecast, unit }) {
  if (!forecast || forecast.length === 0) {
    return (
      <section className="forecast-section">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">COMING UP</p>
            <h2>Five-day outlook</h2>
          </div>
        </div>

        <p className="forecast-unavailable">
          Forecast information is currently unavailable.
        </p>
      </section>
    );
  }

  const temperatureUnit = unit === "metric" ? "°C" : "°F";

  const timezoneOffset =
    forecast[0]?.timezoneOffset ?? 0;

  const dailyForecast = buildDailyForecast(
    forecast.map((entry) => ({
      ...entry,
      timezoneOffset
    }))
  );

  return (
    <section className="forecast-section">
      <div className="section-heading compact-heading">
        <div>
          <p className="section-kicker">PLAN AHEAD</p>
          <h2>Five-day outlook</h2>
        </div>

        <span className="forecast-badge">
          3-HOUR FORECAST DATA
        </span>
      </div>

      <div className="forecast-grid">
        {dailyForecast.map((day, index) => {
          const icon = day.condition?.icon;

          return (
            <article
              className={`forecast-card ${
                index === 0 ? "forecast-today" : ""
              }`}
              key={day.date}
            >
              <p className="forecast-day">
                {index === 0
                  ? "Today"
                  : getDayName(
                      day.timestamp,
                      timezoneOffset
                    )}
              </p>

              <p className="forecast-date">
                {day.date.slice(5)}
              </p>

              {icon ? (
                <img
                  className="forecast-icon"
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={day.condition?.description || "Weather"}
                />
              ) : (
                <div className="forecast-icon-placeholder">
                  —
                </div>
              )}

              <p className="forecast-condition">
                {day.condition?.description || "Unavailable"}
              </p>

              <div className="forecast-temperatures">
                <strong>
                  {typeof day.max === "number"
                    ? `${Math.round(day.max)}${temperatureUnit}`
                    : "—"}
                </strong>

                <span>
                  {typeof day.min === "number"
                    ? `${Math.round(day.min)}${temperatureUnit}`
                    : "—"}
                </span>
              </div>

              <div className="forecast-temperature-track">
                <span />
              </div>
            </article>
          );
        })}
      </div>

      <p className="forecast-note">
        Daily highs and lows are calculated from the available
        three-hour forecast entries, not from a dedicated daily forecast API.
      </p>
    </section>
  );
}

export default Forecast;