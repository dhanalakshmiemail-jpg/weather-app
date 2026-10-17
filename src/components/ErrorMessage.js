function ErrorMessage({
  message,
  onRetry,
  showRetry = true
}) {
  if (!message) {
    return null;
  }

  return (
    <section
      className="error-card"
      role="alert"
      aria-live="assertive"
    >
      <div className="error-icon" aria-hidden="true">
        !
      </div>

      <div className="error-content">
        <h2>We couldn't load your weather</h2>

        <p>{message}</p>

        {showRetry && (
          <button
            type="button"
            className="retry-button"
            onClick={onRetry}
          >
            Try again <span aria-hidden="true">↻</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default ErrorMessage;