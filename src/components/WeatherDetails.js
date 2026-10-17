function WeatherDetails({ weather }) {
  if (!weather) {
    return null;
  }

  const main = weather.main || {};
  const wind = weather.wind || {};
  const clouds = weather.clouds || {};

  const details = [
    {
      label: "Humidity",
      value:
        typeof main.humidity === "number"
          ? `${main.humidity}%`
          : null,
      icon: "◌",
      description: "Moisture in the air"
    },
    {
      label: "Wind speed",
      value:
        typeof wind.speed === "number"
          ? `${wind.speed} m/s`
          : null,
      icon: "≋",
      description: "Current wind velocity"
    },
    {
      label: "Pressure",
      value:
        typeof main.pressure === "number"
          ? `${main.pressure} hPa`
          : null,
      icon: "◉",
      description: "Atmospheric pressure"
    },
    {
      label: "Visibility",
      value:
        typeof weather.visibility === "number"
          ? `${(weather.visibility / 1000).toFixed(1)} km`
          : null,
      icon: "◎",
      description: "Reported viewing distance"
    },
    {
      label: "Cloud coverage",
      value:
        typeof clouds.all === "number"
          ? `${clouds.all}%`
          : null,
      icon: "☁",
      description: "Sky covered by clouds"
    }
  ];

  return (
    <section className="details-section">
      <div className="section-heading compact-heading">
        <div>
          <p className="section-kicker">ATMOSPHERIC DATA</p>
          <h2>Weather at a glance</h2>
        </div>

        <span className="detail-count">05 INDICATORS</span>
      </div>

      <div className="details-grid">
        {details.map((item) => (
          <article className="detail-card" key={item.label}>
            <div className="detail-card-top">
              <span
                className="detail-icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="detail-status">
                LIVE
              </span>
            </div>

            <p className="detail-label">{item.label}</p>

            <p className="detail-value">
              {item.value ?? "Not available"}
            </p>

            <p className="detail-description">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeatherDetails;